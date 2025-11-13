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
    
    def _calculate_min_cost(self, indirect_cost: Decimal = Decimal('0.0')) -> Decimal:
        """
        計算最小可能成本（所有作業都不趕工）
        
        Args:
            indirect_cost: 間接成本（每日）
            
        Returns:
            最小成本（直接成本 + 間接成本）
        """
        # 計算正常工期的直接成本
        min_direct_cost = sum(act.normal_cost for act in self.activities.values())
        
        # 計算正常工期（使用 CPM 方法估算）
        normal_duration = self._calculate_normal_duration()
        
        # 最小總成本 = 最小直接成本 + 間接成本 * 正常工期
        min_total_cost = Decimal(str(min_direct_cost)) + indirect_cost * normal_duration
        
        return min_total_cost
    
    def _calculate_min_duration(self) -> int:
        """
        計算最短可能工期（所有作業都趕工）
        使用關鍵路徑法（CPM）計算
        
        Returns:
            最短工期（天）
        """
        # 使用動態規劃計算關鍵路徑的最短工期
        # 計算每個作業的最早開始時間（所有前置作業都趕工）
        earliest_start = {}
        visited = set()
        
        def get_earliest_start(act_id: str) -> int:
            """遞迴計算作業的最早開始時間"""
            if act_id in earliest_start:
                return earliest_start[act_id]
            
            if act_id in visited:
                # 循環依賴檢測
                return 0
            
            visited.add(act_id)
            
            if act_id not in self.activities:
                return 0
            
            act = self.activities[act_id]
            min_start = 0
            
            # 找出所有前置作業
            for successor_id, predecessor_id in self.precedences:
                if successor_id == act_id:
                    pred_start = get_earliest_start(predecessor_id)
                    pred_act = self.activities[predecessor_id]
                    pred_end = pred_start + pred_act.crash_duration
                    min_start = max(min_start, pred_end)
            
            earliest_start[act_id] = min_start
            return min_start
        
        # 計算所有作業的最早開始時間
        for act_id in self.activities.keys():
            get_earliest_start(act_id)
        
        # 找出最晚結束時間（即專案最短工期）
        min_duration = 0
        for act_id, act in self.activities.items():
            start_time = earliest_start.get(act_id, 0)
            end_time = start_time + act.crash_duration
            min_duration = max(min_duration, end_time)
        
        return min_duration
    
    def _calculate_normal_duration(self) -> int:
        """
        計算正常工期（所有作業都不趕工）
        使用關鍵路徑法（CPM）計算
        
        Returns:
            正常工期（天）
        """
        # 使用動態規劃計算關鍵路徑的正常工期
        earliest_start = {}
        visited = set()
        
        def get_earliest_start(act_id: str) -> int:
            """遞迴計算作業的最早開始時間"""
            if act_id in earliest_start:
                return earliest_start[act_id]
            
            if act_id in visited:
                return 0
            
            visited.add(act_id)
            
            if act_id not in self.activities:
                return 0
            
            act = self.activities[act_id]
            min_start = 0
            
            # 找出所有前置作業
            for successor_id, predecessor_id in self.precedences:
                if successor_id == act_id:
                    pred_start = get_earliest_start(predecessor_id)
                    pred_act = self.activities[predecessor_id]
                    pred_end = pred_start + pred_act.normal_duration
                    min_start = max(min_start, pred_end)
            
            earliest_start[act_id] = min_start
            return min_start
        
        # 計算所有作業的最早開始時間
        for act_id in self.activities.keys():
            get_earliest_start(act_id)
        
        # 找出最晚結束時間（即專案正常工期）
        normal_duration = 0
        for act_id, act in self.activities.items():
            start_time = earliest_start.get(act_id, 0)
            end_time = start_time + act.normal_duration
            normal_duration = max(normal_duration, end_time)
        
        return normal_duration
        
    def solve_budget_to_duration(self, budget: Decimal, indirect_cost: Decimal = Decimal('0.0'),
                                penalty_type: str = 'rate',
                                penalty_amount: Optional[Decimal] = None,
                                penalty_rate: Optional[Decimal] = None,
                                contract_amount: Decimal = Decimal('0.0'),
                                contract_duration: Optional[int] = None,
                                target_duration: Optional[int] = None) -> Dict:
        """
        模式一：給定預算，求最短工期
        
        Args:
            budget: 預算約束
            penalty_type: 違約金計算方式（'fixed' 定額 或 'rate' 比率）
            penalty_amount: 定額違約金（每日，當 penalty_type='fixed' 時使用）
            penalty_rate: 比率違約金（每日，契約金額比率，當 penalty_type='rate' 時使用）
            contract_amount: 契約決標總價（用於計算違約金上限和趕工獎金）
            contract_duration: 契約工期（天，用於計算趕工獎金）
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
            # 計算違約金（根據計算方式）
            penalty_days = pulp.LpVariable("penalty_days", lowBound=0, cat='Integer')
            self.problem += penalty_days >= (T - target_duration)
            self.problem += penalty_days >= 0
            
            if penalty_type == 'fixed' and penalty_amount:
                # 定額計算：每日固定金額
                penalty_term = float(penalty_amount) * penalty_days
            elif penalty_type == 'rate' and penalty_rate and contract_amount:
                # 比率計算：契約金額的一定比率（每日）
                daily_penalty = float(penalty_rate) * float(contract_amount)
                penalty_term = daily_penalty * penalty_days
            # 注意：違約金上限在結果計算時檢查，不在 MILP 模型中約束
            
            # 如果提前完成，計算趕工費用（根據法規）
            # 每日趕工費用 = (契約決標總價 / 契約工期) × 15%
            if contract_amount and contract_duration and contract_duration > 0:
                daily_bonus = (float(contract_amount) / contract_duration) * 0.15
                bonus_days = pulp.LpVariable("bonus_days", lowBound=0, cat='Integer')
                self.problem += bonus_days >= (target_duration - T)
                self.problem += bonus_days >= 0
                bonus_term = daily_bonus * bonus_days
                
                # 趕工費用上限：契約決標總價的 3%
                bonus_limit = float(contract_amount) * 0.03
                self.problem += bonus_term <= bonus_limit
            else:
                bonus_term = 0
        
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
            error_message = f'求解失敗：{pulp.LpStatus[self.problem.status]}'
            
            # 如果是 Infeasible，提供詳細原因
            if self.problem.status == pulp.LpStatusInfeasible:
                # 計算最小成本
                min_cost = self._calculate_min_cost(indirect_cost)
                
                # 分析原因
                reasons = []
                if min_cost > budget:
                    reasons.append(f"預算不足：即使所有作業都不趕工，最小成本也需要 {min_cost:.2f}，但預算只有 {budget:.2f}（差距：{min_cost - budget:.2f}）")
                else:
                    # 可能是間接成本導致預算不足
                    normal_duration = self._calculate_normal_duration()
                    min_cost_with_indirect = min_cost
                    if min_cost_with_indirect > budget:
                        reasons.append(f"預算不足：考慮間接成本後，最小成本 {min_cost_with_indirect:.2f} 超過預算 {budget:.2f}")
                    else:
                        reasons.append("預算約束與其他約束條件衝突，無法找到可行解")
                
                error_message = f"無可行解（Infeasible）。原因：{'；'.join(reasons)}。建議：增加預算或調整作業參數。"
            
            return {
                'status': 'infeasible' if self.problem.status == pulp.LpStatusInfeasible else 'error',
                'error_message': error_message,
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
        calculated_penalty = Decimal('0.0')
        bonus_amount = Decimal('0.0')
        if target_duration:
            if optimal_duration > target_duration:
                overdue_days = optimal_duration - target_duration
                # 根據計算方式計算違約金
                if penalty_type == 'fixed' and penalty_amount:
                    calculated_penalty = penalty_amount * overdue_days
                elif penalty_type == 'rate' and penalty_rate and contract_amount:
                    daily_penalty = penalty_rate * contract_amount
                    calculated_penalty = daily_penalty * overdue_days
                
                # 違約金上限：契約價金總額的 20%
                if contract_amount > 0:
                    penalty_limit = contract_amount * Decimal('0.2')
                    calculated_penalty = min(calculated_penalty, penalty_limit)
            elif optimal_duration < target_duration:
                # 根據法規計算趕工獎金
                # 趕工獎金 = 合約總價 × 提前之工期 ÷ 合約工期 × 5%
                if contract_amount and contract_duration and contract_duration > 0:
                    early_days = target_duration - optimal_duration
                    bonus_amount = (contract_amount * Decimal(str(early_days)) / Decimal(str(contract_duration))) * Decimal('0.05')
                    
                    # 趕工獎金上限：合約總價的 1%
                    bonus_limit = contract_amount * Decimal('0.01')
                    bonus_amount = min(bonus_amount, bonus_limit)
                else:
                    bonus_amount = Decimal('0.0')
        
        optimal_cost = Decimal(str(direct_cost)) + indirect_cost_amount
        total_cost = optimal_cost + calculated_penalty - bonus_amount
        
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
            'penalty_amount': calculated_penalty,
            'bonus_amount': bonus_amount,
            'total_cost': total_cost,
            'calculation_time': calculation_time,
            'schedules': schedules
        }
    
    def solve_duration_to_cost(self, duration: int, indirect_cost: Decimal = Decimal('0.0'),
                               penalty_type: str = 'rate',
                               penalty_amount: Optional[Decimal] = None,
                               penalty_rate: Optional[Decimal] = None,
                               contract_amount: Decimal = Decimal('0.0'),
                               contract_duration: Optional[int] = None,
                               target_duration: Optional[int] = None) -> Dict:
        """
        模式二：給定工期，求最低成本
        
        Args:
            duration: 工期約束
            penalty_type: 違約金計算方式（'fixed' 定額 或 'rate' 比率）
            penalty_amount: 定額違約金（每日，當 penalty_type='fixed' 時使用）
            penalty_rate: 比率違約金（每日，契約金額比率，當 penalty_type='rate' 時使用）
            contract_amount: 契約決標總價（用於計算違約金上限和趕工獎金）
            contract_duration: 契約工期（天，用於計算趕工獎金）
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
            # 計算違約金（根據計算方式）
            penalty_days = pulp.LpVariable("penalty_days", lowBound=0, cat='Integer')
            self.problem += penalty_days >= (T - target_duration)
            self.problem += penalty_days >= 0
            
            if penalty_type == 'fixed' and penalty_amount:
                # 定額計算：每日固定金額
                penalty_term = float(penalty_amount) * penalty_days
            elif penalty_type == 'rate' and penalty_rate and contract_amount:
                # 比率計算：契約金額的一定比率（每日）
                daily_penalty = float(penalty_rate) * float(contract_amount)
                penalty_term = daily_penalty * penalty_days
            # 注意：違約金上限在結果計算時檢查，不在 MILP 模型中約束
            
            # 如果提前完成，計算趕工費用（根據法規）
            # 每日趕工費用 = (契約決標總價 / 契約工期) × 15%
            if contract_amount and contract_duration and contract_duration > 0:
                daily_bonus = (float(contract_amount) / contract_duration) * 0.15
                bonus_days = pulp.LpVariable("bonus_days", lowBound=0, cat='Integer')
                self.problem += bonus_days >= (target_duration - T)
                self.problem += bonus_days >= 0
                bonus_term = daily_bonus * bonus_days
                
                # 趕工費用上限：契約決標總價的 3%
                bonus_limit = float(contract_amount) * 0.03
                self.problem += bonus_term <= bonus_limit
            else:
                bonus_term = 0
        
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
            error_message = f'求解失敗：{pulp.LpStatus[self.problem.status]}'
            
            # 如果是 Infeasible，提供詳細原因
            if self.problem.status == pulp.LpStatusInfeasible:
                # 計算最短工期
                min_duration = self._calculate_min_duration()
                
                # 分析原因
                reasons = []
                if min_duration > duration:
                    reasons.append(f"工期約束過緊：即使所有作業都趕工，最短工期也需要 {min_duration} 天，但約束工期只有 {duration} 天（差距：{min_duration - duration} 天）")
                else:
                    reasons.append("工期約束與其他約束條件衝突，無法找到可行解")
                
                error_message = f"無可行解（Infeasible）。原因：{'；'.join(reasons)}。建議：放寬工期約束或調整作業參數。"
            
            return {
                'status': 'infeasible' if self.problem.status == pulp.LpStatusInfeasible else 'error',
                'error_message': error_message,
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
        calculated_penalty = Decimal('0.0')
        bonus_amount = Decimal('0.0')
        if target_duration:
            if optimal_duration > target_duration:
                overdue_days = optimal_duration - target_duration
                # 根據計算方式計算違約金
                if penalty_type == 'fixed' and penalty_amount:
                    calculated_penalty = penalty_amount * overdue_days
                elif penalty_type == 'rate' and penalty_rate and contract_amount:
                    daily_penalty = penalty_rate * contract_amount
                    calculated_penalty = daily_penalty * overdue_days
                
                # 違約金上限：契約價金總額的 20%
                if contract_amount > 0:
                    penalty_limit = contract_amount * Decimal('0.2')
                    calculated_penalty = min(calculated_penalty, penalty_limit)
            elif optimal_duration < target_duration:
                # 根據法規計算趕工獎金
                # 趕工獎金 = 合約總價 × 提前之工期 ÷ 合約工期 × 5%
                if contract_amount and contract_duration and contract_duration > 0:
                    early_days = target_duration - optimal_duration
                    bonus_amount = (contract_amount * Decimal(str(early_days)) / Decimal(str(contract_duration))) * Decimal('0.05')
                    
                    # 趕工獎金上限：合約總價的 1%
                    bonus_limit = contract_amount * Decimal('0.01')
                    bonus_amount = min(bonus_amount, bonus_limit)
                else:
                    bonus_amount = Decimal('0.0')
        
        optimal_cost = Decimal(str(direct_cost)) + indirect_cost_amount
        total_cost_value = optimal_cost + calculated_penalty - bonus_amount
        
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
            'penalty_amount': calculated_penalty,
            'bonus_amount': bonus_amount,
            'total_cost': total_cost_value,
            'calculation_time': calculation_time,
            'schedules': schedules
        }
    

