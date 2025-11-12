"""
投標最佳化決策系統 - MILP 模型實作
使用 PuLP 求解整數線性規劃問題
"""
import pulp
from typing import List, Dict, Tuple, Optional
from decimal import Decimal
import time


class Activity:
    """作業活動類別"""
    def __init__(self, activity_id: str, name: str, normal_duration: int, 
                 normal_cost: Decimal, crash_duration: int, crash_cost: Decimal):
        self.id = activity_id
        self.name = name
        self.normal_duration = normal_duration
        self.normal_cost = float(normal_cost)
        self.crash_duration = crash_duration
        self.crash_cost = float(crash_cost)
        # 計算趕工成本斜率
        if normal_duration > crash_duration:
            self.crash_slope = (crash_cost - normal_cost) / (normal_duration - crash_duration)
        else:
            self.crash_slope = 0


class BiddingOptimizer:
    """投標最佳化決策模型"""
    
    def __init__(self, activities: List[Activity], precedences: List[Tuple[str, str]]):
        """
        初始化優化器
        
        Args:
            activities: 作業活動列表
            precedences: 前置關係列表，格式為 [(後續作業ID, 前置作業ID), ...]
        """
        self.activities = {act.id: act for act in activities}
        self.precedences = precedences
        self.problem = None
        self.solution = None
        
    def solve_budget_to_duration(self, budget: Decimal, indirect_cost: Decimal = Decimal('0.0'),
                                penalty_rate: Decimal = Decimal('0.0'),
                                bonus_rate: Decimal = Decimal('0.0'), 
                                target_duration: Optional[int] = None) -> Dict:
        """
        模式一：給定預算，求最短工期
        
        Args:
            budget: 預算約束
            penalty_rate: 逾期違約金率（每日）
            bonus_rate: 趕工獎金率（每日）
            target_duration: 目標工期（用於計算獎懲）
            
        Returns:
            包含優化結果的字典
        """
        start_time = time.time()
        
        # 建立 MILP 問題
        self.problem = pulp.LpProblem("Budget_To_Duration", pulp.LpMinimize)
        
        # 決策變數
        # x[i]: 作業 i 的開始時間
        x = {act_id: pulp.LpVariable(f"x_{act_id}", lowBound=0, cat='Integer') 
             for act_id in self.activities.keys()}
        
        # y[i]: 作業 i 是否趕工（0/1 二元變數）
        y = {act_id: pulp.LpVariable(f"y_{act_id}", cat='Binary') 
             for act_id in self.activities.keys()}
        
        # T: 專案總工期
        T = pulp.LpVariable("T", lowBound=0, cat='Integer')
        
        # 目標函數：最小化工期 + 違約金 - 獎金
        penalty_term = 0
        bonus_term = 0
        
        if target_duration:
            # 如果超過目標工期，計算違約金
            penalty_term = penalty_rate * pulp.LpVariable("penalty_days", lowBound=0, cat='Integer')
            self.problem += penalty_term >= penalty_rate * (T - target_duration)
            
            # 如果提前完成，計算獎金
            bonus_term = bonus_rate * pulp.LpVariable("bonus_days", lowBound=0, cat='Integer')
            self.problem += bonus_term <= bonus_rate * (target_duration - T)
            self.problem += bonus_term >= 0
        
        self.problem += T + penalty_term - bonus_term
        
        # 約束條件
        
        # 1. 前置作業約束：後續作業的開始時間 >= 前置作業的結束時間
        for successor_id, predecessor_id in self.precedences:
            if successor_id in self.activities and predecessor_id in self.activities:
                pred_act = self.activities[predecessor_id]
                # 前置作業的結束時間 = 開始時間 + 工期
                pred_duration = (pred_act.normal_duration * (1 - y[predecessor_id]) + 
                                pred_act.crash_duration * y[predecessor_id])
                self.problem += x[successor_id] >= x[predecessor_id] + pred_duration
        
        # 2. 工期約束：總工期 >= 所有作業的結束時間
        for act_id, act in self.activities.items():
            duration = (act.normal_duration * (1 - y[act_id]) + 
                        act.crash_duration * y[act_id])
            self.problem += T >= x[act_id] + duration
        
        # 3. 預算約束：總成本（直接成本 + 間接成本） <= 預算
        direct_cost = pulp.lpSum([
            (act.normal_cost * (1 - y[act_id]) + act.crash_cost * y[act_id])
            for act_id, act in self.activities.items()
        ])
        # 間接成本 = 間接成本率 * 總工期
        indirect_cost_term = float(indirect_cost) * T
        total_cost = direct_cost + indirect_cost_term
        self.problem += total_cost <= float(budget)
        
        # 求解
        self.problem.solve(pulp.PULP_CBC_CMD(msg=0))
        
        calculation_time = time.time() - start_time
        
        # 檢查求解狀態
        if self.problem.status != pulp.LpStatusOptimal:
            return {
                'status': 'infeasible' if self.problem.status == pulp.LpStatusInfeasible else 'error',
                'error_message': f'求解失敗：{pulp.LpStatus[self.problem.status]}',
                'calculation_time': calculation_time
            }
        
        # 提取結果
        optimal_duration = int(pulp.value(T))
        direct_cost = sum([
            (act.normal_cost if y[act_id].varValue == 0 else act.crash_cost)
            for act_id, act in self.activities.items()
        ])
        # 計算間接成本
        indirect_cost_amount = indirect_cost * optimal_duration
        
        # 計算獎懲金額
        penalty_amount = Decimal('0.0')
        bonus_amount = Decimal('0.0')
        if target_duration:
            if optimal_duration > target_duration:
                penalty_amount = penalty_rate * (optimal_duration - target_duration)
            elif optimal_duration < target_duration:
                bonus_amount = bonus_rate * (target_duration - optimal_duration)
        
        optimal_cost = Decimal(str(direct_cost)) + indirect_cost_amount
        total_cost = optimal_cost + penalty_amount - bonus_amount
        
        # 提取作業排程
        schedules = []
        for act_id, act in self.activities.items():
            start_time = int(x[act_id].varValue)
            is_crashed = bool(y[act_id].varValue)
            duration = act.crash_duration if is_crashed else act.normal_duration
            cost = act.crash_cost if is_crashed else act.normal_cost
            
            schedules.append({
                'activity_id': act_id,
                'activity_name': act.name,
                'start_time': start_time,
                'end_time': start_time + duration,
                'duration': duration,
                'is_crashed': is_crashed,
                'cost': Decimal(str(cost))
            })
        
        return {
            'status': 'success',
            'optimal_duration': optimal_duration,
            'optimal_cost': Decimal(str(direct_cost)),
            'indirect_cost': indirect_cost_amount,
            'penalty_amount': penalty_amount,
            'bonus_amount': bonus_amount,
            'total_cost': total_cost,
            'calculation_time': calculation_time,
            'schedules': schedules
        }
    
    def solve_duration_to_cost(self, duration: int, indirect_cost: Decimal = Decimal('0.0'),
                               penalty_rate: Decimal = Decimal('0.0'),
                               bonus_rate: Decimal = Decimal('0.0'),
                               target_duration: Optional[int] = None) -> Dict:
        """
        模式二：給定工期，求最低成本
        
        Args:
            duration: 工期約束
            penalty_rate: 逾期違約金率（每日）
            bonus_rate: 趕工獎金率（每日）
            target_duration: 目標工期（用於計算獎懲）
            
        Returns:
            包含優化結果的字典
        """
        start_time = time.time()
        
        # 建立 MILP 問題
        self.problem = pulp.LpProblem("Duration_To_Cost", pulp.LpMinimize)
        
        # 決策變數
        x = {act_id: pulp.LpVariable(f"x_{act_id}", lowBound=0, cat='Integer') 
             for act_id in self.activities.keys()}
        
        y = {act_id: pulp.LpVariable(f"y_{act_id}", cat='Binary') 
             for act_id in self.activities.keys()}
        
        T = pulp.LpVariable("T", lowBound=0, cat='Integer')
        
        # 目標函數：最小化總成本（直接成本 + 間接成本）+ 違約金 - 獎金
        direct_cost = pulp.lpSum([
            (act.normal_cost * (1 - y[act_id]) + act.crash_cost * y[act_id])
            for act_id, act in self.activities.items()
        ])
        # 間接成本 = 間接成本率 * 總工期
        indirect_cost_term = float(indirect_cost) * T
        total_cost = direct_cost + indirect_cost_term
        
        penalty_term = 0
        bonus_term = 0
        
        if target_duration:
            penalty_term = penalty_rate * pulp.LpVariable("penalty_days", lowBound=0, cat='Integer')
            self.problem += penalty_term >= penalty_rate * (T - target_duration)
            
            bonus_term = bonus_rate * pulp.LpVariable("bonus_days", lowBound=0, cat='Integer')
            self.problem += bonus_term <= bonus_rate * (target_duration - T)
            self.problem += bonus_term >= 0
        
        self.problem += total_cost + penalty_term - bonus_term
        
        # 約束條件
        
        # 1. 前置作業約束
        for successor_id, predecessor_id in self.precedences:
            if successor_id in self.activities and predecessor_id in self.activities:
                pred_act = self.activities[predecessor_id]
                pred_duration = (pred_act.normal_duration * (1 - y[predecessor_id]) + 
                                pred_act.crash_duration * y[predecessor_id])
                self.problem += x[successor_id] >= x[predecessor_id] + pred_duration
        
        # 2. 工期約束
        for act_id, act in self.activities.items():
            duration_var = (act.normal_duration * (1 - y[act_id]) + 
                           act.crash_duration * y[act_id])
            self.problem += T >= x[act_id] + duration_var
        
        # 3. 工期約束：總工期 <= 目標工期
        self.problem += T <= duration
        
        # 求解
        self.problem.solve(pulp.PULP_CBC_CMD(msg=0))
        
        calculation_time = time.time() - start_time
        
        # 檢查求解狀態
        if self.problem.status != pulp.LpStatusOptimal:
            return {
                'status': 'infeasible' if self.problem.status == pulp.LpStatusInfeasible else 'error',
                'error_message': f'求解失敗：{pulp.LpStatus[self.problem.status]}',
                'calculation_time': calculation_time
            }
        
        # 提取結果
        optimal_duration = int(pulp.value(T))
        direct_cost = sum([
            (act.normal_cost if y[act_id].varValue == 0 else act.crash_cost)
            for act_id, act in self.activities.items()
        ])
        # 計算間接成本
        indirect_cost_amount = indirect_cost * optimal_duration
        
        # 計算獎懲金額
        penalty_amount = Decimal('0.0')
        bonus_amount = Decimal('0.0')
        if target_duration:
            if optimal_duration > target_duration:
                penalty_amount = penalty_rate * (optimal_duration - target_duration)
            elif optimal_duration < target_duration:
                bonus_amount = bonus_rate * (target_duration - optimal_duration)
        
        optimal_cost = Decimal(str(direct_cost)) + indirect_cost_amount
        total_cost_value = optimal_cost + penalty_amount - bonus_amount
        
        # 提取作業排程
        schedules = []
        for act_id, act in self.activities.items():
            start_time = int(x[act_id].varValue)
            is_crashed = bool(y[act_id].varValue)
            duration_var = act.crash_duration if is_crashed else act.normal_duration
            cost = act.crash_cost if is_crashed else act.normal_cost
            
            schedules.append({
                'activity_id': act_id,
                'activity_name': act.name,
                'start_time': start_time,
                'end_time': start_time + duration_var,
                'duration': duration_var,
                'is_crashed': is_crashed,
                'cost': Decimal(str(cost))
            })
        
        return {
            'status': 'success',
            'optimal_duration': optimal_duration,
            'optimal_cost': Decimal(str(direct_cost)),
            'indirect_cost': indirect_cost_amount,
            'penalty_amount': penalty_amount,
            'bonus_amount': bonus_amount,
            'total_cost': total_cost_value,
            'calculation_time': calculation_time,
            'schedules': schedules
        }
    
    def generate_crashing_plans(self, contract_duration: int, indirect_cost: Decimal = Decimal('0.0'),
                                 penalty_rate: Decimal = Decimal('0.0'),
                                 bonus_rate: Decimal = Decimal('0.0')) -> List[Dict]:
        """
        生成趕工計劃：從正常工期逐步壓縮到契約工期，生成所有趕工循環方案
        
        Args:
            contract_duration: 契約工期（目標工期）
            indirect_cost: 間接成本（每日）
            penalty_rate: 逾期違約金率（每日）
            bonus_rate: 趕工獎金率（每日）
            
        Returns:
            趕工計劃列表，每個元素包含一個趕工循環的資訊
        """
        plans = []
        
        # 1. 計算正常工期（所有作業都不趕工）
        normal_result = self.solve_duration_to_cost(
            duration=9999,  # 設定一個很大的工期約束
            indirect_cost=indirect_cost,
            penalty_rate=penalty_rate,
            bonus_rate=bonus_rate,
            target_duration=contract_duration
        )
        
        if normal_result['status'] != 'success':
            return plans
        
        normal_duration = normal_result['optimal_duration']
        
        # 如果正常工期已經小於等於契約工期，只需要一個方案
        if normal_duration <= contract_duration:
            # 計算正常方案
            penalty = Decimal('0.0')
            bonus = Decimal('0.0')
            if normal_duration > contract_duration:
                penalty = penalty_rate * (normal_duration - contract_duration)
            elif normal_duration < contract_duration:
                bonus = bonus_rate * (contract_duration - normal_duration)
            
            crashed_activities = []
            for s in normal_result['schedules']:
                if s['is_crashed']:
                    act = self.activities[s['activity_id']]
                    days_saved = act.normal_duration - s['duration']
                    if days_saved > 0:
                        crashed_activities.append(f"{s['activity_name']}→{days_saved}")
            
            plans.append({
                'cycle': 0,
                'total_duration': normal_duration,
                'crashed_activities': '--' if not crashed_activities else ', '.join(crashed_activities),
                'direct_cost': normal_result['optimal_cost'],
                'indirect_cost': normal_result['indirect_cost'],
                'bonus': bonus,
                'penalty': penalty,
                'total_cost': normal_result['total_cost'],
                'schedules': normal_result['schedules']
            })
            return plans
        
        # 2. 逐步壓縮：從正常工期逐步壓縮到契約工期
        current_duration = normal_duration
        cycle = 0
        previous_schedules = None
        
        while current_duration > contract_duration:
            # 求解當前工期的最優方案
            result = self.solve_duration_to_cost(
                duration=current_duration,
                indirect_cost=indirect_cost,
                penalty_rate=penalty_rate,
                bonus_rate=bonus_rate,
                target_duration=contract_duration
            )
            
            if result['status'] != 'success':
                break
            
            # 計算獎懲
            penalty = Decimal('0.0')
            bonus = Decimal('0.0')
            if result['optimal_duration'] > contract_duration:
                penalty = penalty_rate * (result['optimal_duration'] - contract_duration)
            elif result['optimal_duration'] < contract_duration:
                bonus = bonus_rate * (contract_duration - result['optimal_duration'])
            
            # 找出本循環中被壓縮的作業
            crashed_activities = []
            if previous_schedules:
                # 比較前一個循環和當前循環，找出新壓縮的作業
                prev_crashed = {s['activity_id']: s for s in previous_schedules if s['is_crashed']}
                for s in result['schedules']:
                    if s['is_crashed']:
                        act = self.activities[s['activity_id']]
                        if s['activity_id'] in prev_crashed:
                            prev_duration = prev_crashed[s['activity_id']]['duration']
                            if s['duration'] < prev_duration:
                                days_saved = prev_duration - s['duration']
                                crashed_activities.append(f"{s['activity_name']}→{days_saved}")
                        else:
                            # 新壓縮的作業
                            days_saved = act.normal_duration - s['duration']
                            crashed_activities.append(f"{s['activity_name']}→{days_saved}")
            else:
                # 第一個循環，找出所有被壓縮的作業
                for s in result['schedules']:
                    if s['is_crashed']:
                        act = self.activities[s['activity_id']]
                        days_saved = act.normal_duration - s['duration']
                        if days_saved > 0:
                            crashed_activities.append(f"{s['activity_name']}→{days_saved}")
            
            plans.append({
                'cycle': cycle,
                'total_duration': result['optimal_duration'],
                'crashed_activities': '--' if not crashed_activities else ', '.join(crashed_activities),
                'direct_cost': result['optimal_cost'],
                'indirect_cost': result['indirect_cost'],
                'bonus': bonus,
                'penalty': penalty,
                'total_cost': result['total_cost'],
                'schedules': result['schedules']
            })
            
            # 準備下一個循環
            current_duration = result['optimal_duration'] - 1
            previous_schedules = result['schedules']
            cycle += 1
            
            # 安全檢查：避免無限循環
            if cycle > 100:
                break
        
        return plans

