<template>
  <div class="optimization-process">
    <el-card class="process-card">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">{{ $t('optimizationProcess.title') }}</h2>
        </div>
      </template>

      <!-- 問題類型說明 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.problemType.title') }}</h3>
        <div class="content-box">
          <p><strong>{{ $t('optimizationProcess.problemType.milp') }}</strong></p>
          <p class="description">
            {{ $t('optimizationProcess.problemType.description') }}
          </p>
        </div>
      </div>

      <!-- 優化模式 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.mode.title') }}</h3>
        <div class="content-box">
          <div class="mode-badge" :class="`mode-${optimizationData.mode}`">
            {{ optimizationData.mode === 'budget_to_duration' ? $t('optimizationProcess.mode.budgetToDuration') : $t('optimizationProcess.mode.durationToCost') }}
          </div>
          <div class="constraints-list">
            <div v-if="optimizationData.mode === 'budget_to_duration'" class="constraint-item">
              <span class="constraint-label">{{ $t('optimizationProcess.mode.budgetConstraint') }}</span>
              <span class="constraint-value">{{ formatCurrency(optimizationData.budget_constraint) }}</span>
            </div>
            <div v-else class="constraint-item">
              <span class="constraint-label">{{ $t('optimizationProcess.mode.durationConstraint') }}</span>
              <span class="constraint-value">{{ optimizationData.duration_constraint }} {{ $t('common.days') }}</span>
            </div>
            <div v-if="optimizationData.indirect_cost" class="constraint-item">
              <span class="constraint-label">{{ $t('optimizationProcess.mode.indirectCost') }}</span>
              <span class="constraint-value">{{ formatCurrency(optimizationData.indirect_cost) }}{{ $t('optimizationProcess.mode.perDay') }}</span>
            </div>
            <div v-if="optimizationData.target_duration" class="constraint-item">
              <span class="constraint-label">{{ $t('optimizationProcess.mode.targetDuration') }}</span>
              <span class="constraint-value">{{ optimizationData.target_duration }} {{ $t('common.days') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 數學模型 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.model.title') }}</h3>
        
        <!-- 決策變數 -->
        <div class="subsection">
          <h4 class="subsection-title">{{ $t('optimizationProcess.model.variables.title') }}</h4>
          <div class="formula-box">
            <div class="formula-item">
              <span class="formula-var">x<sub>i</sub></span>
              <span class="formula-desc">{{ $t('optimizationProcess.model.variables.xi') }}</span>
            </div>
            <div class="formula-item">
              <span class="formula-var">y<sub>i</sub></span>
              <span class="formula-desc">{{ $t('optimizationProcess.model.variables.yi') }}</span>
            </div>
            <div class="formula-item">
              <span class="formula-var">T</span>
              <span class="formula-desc">{{ $t('optimizationProcess.model.variables.t') }}</span>
            </div>
          </div>
          <div class="variable-details">
            <p><strong>{{ $t('optimizationProcess.model.variables.totalCount') }}</strong></p>
            <ul>
              <li>{{ $t('optimizationProcess.model.variables.continuous', { count: activities.length + 1, activityCount: activities.length }) }}</li>
              <li>{{ $t('optimizationProcess.model.variables.binary', { count: activities.length }) }}</li>
            </ul>
          </div>
        </div>

        <!-- 目標函數 -->
        <div class="subsection">
          <h4 class="subsection-title">{{ $t('optimizationProcess.model.objective.title') }}</h4>
          <div class="formula-box">
            <div v-if="optimizationData.mode === 'budget_to_duration'" class="objective-formula">
              <div class="formula-line">
                <strong>{{ $t('optimizationProcess.model.objective.minimize') }}</strong> min Z = T + P - B
              </div>
              <div class="formula-explanation">
                <p>{{ $t('optimizationProcess.model.objective.explanation') }}</p>
                <ul>
                  <li>
                    <strong>T</strong>：{{ $t('optimizationProcess.model.objective.totalDuration') }}
                    <span class="calc-value"> = {{ result.optimal_duration }} {{ $t('common.days') }}</span>
                  </li>
                  <li>
                    <strong>P</strong>：{{ $t('optimizationProcess.model.objective.penalty') }}
                    <span class="calc-value"> = {{ formatCurrency(result.penalty_amount) }}</span>
                  </li>
                  <li>
                    <strong>B</strong>：{{ $t('optimizationProcess.model.objective.bonus') }}
                    <span class="calc-value"> = {{ formatCurrency(result.bonus_amount) }}</span>
                  </li>
                </ul>
                <div class="total-calc">
                  <strong>{{ $t('optimizationProcess.model.objective.totalObjective') }}</strong>
                  {{ result.optimal_duration }} {{ $t('common.days') }} + {{ formatCurrency(result.penalty_amount) }} 
                  - {{ formatCurrency(result.bonus_amount) }}
                  <br>
                  <strong>{{ $t('optimizationProcess.model.objective.totalCostWithPenalty') }}</strong>
                  {{ formatCurrency(result.optimal_cost) }} + {{ formatCurrency(result.indirect_cost) }} 
                  + {{ formatCurrency(result.penalty_amount) }} - {{ formatCurrency(result.bonus_amount) }}
                  = <span class="highlight">{{ formatCurrency(result.total_cost) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="objective-formula">
              <div class="formula-line">
                <strong>{{ $t('optimizationProcess.model.objective.minimize') }}</strong> min Z = C<sub>{{ $t('optimizationProcess.model.objective.directCost') }}</sub> + C<sub>{{ $t('optimizationProcess.model.objective.indirectCost') }}</sub> + P - B
              </div>
              <div class="formula-explanation">
                <p>{{ $t('optimizationProcess.model.objective.explanation') }}</p>
                <ul>
                  <li>
                    <strong>C<sub>{{ $t('optimizationProcess.model.objective.directCost') }}</sub></strong> = Σ [c<sub>i,正常</sub> × (1 - y<sub>i</sub>) + c<sub>i,趕工</sub> × y<sub>i</sub>]
                    <span class="calc-value"> = {{ formatCurrency(result.optimal_cost) }}</span>
                  </li>
                  <li>
                    <strong>C<sub>{{ $t('optimizationProcess.model.objective.indirectCost') }}</sub></strong> = {{ $t('optimizationProcess.mode.indirectCost') }} × T = {{ formatCurrency(optimizationData.indirect_cost) }} × {{ result.optimal_duration }}
                    <span class="calc-value"> = {{ formatCurrency(result.indirect_cost) }}</span>
                  </li>
                  <li>
                    <strong>P</strong>：{{ $t('optimizationProcess.model.objective.penalty') }}
                    <span class="calc-value"> = {{ formatCurrency(result.penalty_amount) }}</span>
                  </li>
                  <li>
                    <strong>B</strong>：{{ $t('optimizationProcess.model.objective.bonus') }}
                    <span class="calc-value"> = {{ formatCurrency(result.bonus_amount) }}</span>
                  </li>
                </ul>
                <div class="total-calc">
                  <strong>{{ $t('optimizationProcess.model.objective.totalObjective') }}</strong>
                  {{ formatCurrency(result.optimal_cost) }} + {{ formatCurrency(result.indirect_cost) }} 
                  + {{ formatCurrency(result.penalty_amount) }} - {{ formatCurrency(result.bonus_amount) }}
                  = <span class="highlight">{{ formatCurrency(result.total_cost) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 限制式 -->
        <div class="subsection">
          <h4 class="subsection-title">{{ $t('optimizationProcess.model.constraints.title') }}</h4>
          <div class="constraints-box">
            <div class="constraint-group">
              <div class="constraint-title">
                <el-icon><Check /></el-icon>
                {{ $t('optimizationProcess.model.constraints.precedence.title', { count: precedences.length }) }}
              </div>
              <div class="constraint-formula">
                {{ $t('optimizationProcess.model.constraints.precedence.formula') }}
              </div>
              <div class="constraint-desc">
                <em>{{ $t('optimizationProcess.model.constraints.precedence.description') }}</em>
              </div>
              <div v-if="precedences.length > 0" class="constraint-example">
                <strong>{{ $t('optimizationProcess.model.constraints.precedence.example') }}</strong>
                <div v-for="(prec, idx) in precedences.slice(0, 3)" :key="idx" class="example-item">
                  {{ $t('optimizationProcess.model.constraints.precedence.exampleItem', { 
                    successor: getActivityName(prec.successor), 
                    predecessor: getActivityName(prec.predecessor) 
                  }) }}
                </div>
                <div v-if="precedences.length > 3" class="more-info">
                  {{ $t('optimizationProcess.model.constraints.precedence.more', { count: precedences.length }) }}
                </div>
              </div>
            </div>

            <div class="constraint-group">
              <div class="constraint-title">
                <el-icon><Check /></el-icon>
                {{ $t('optimizationProcess.model.constraints.duration.title', { count: activities.length }) }}
              </div>
              <div class="constraint-formula">
                {{ $t('optimizationProcess.model.constraints.duration.formula') }}
              </div>
              <div class="constraint-desc">
                <em>{{ $t('optimizationProcess.model.constraints.duration.description') }}</em>
              </div>
            </div>

            <div v-if="optimizationData.mode === 'budget_to_duration'" class="constraint-group">
              <div class="constraint-title">
                <el-icon><Check /></el-icon>
                {{ $t('optimizationProcess.model.constraints.budget.title') }}
              </div>
              <div class="constraint-formula">
                C<sub>{{ $t('optimizationProcess.model.objective.directCost') }}</sub> + C<sub>{{ $t('optimizationProcess.model.objective.indirectCost') }}</sub> ≤ {{ formatCurrency(optimizationData.budget_constraint) }}
              </div>
              <div class="constraint-desc">
                <em>{{ $t('optimizationProcess.model.constraints.budget.description') }}</em>
              </div>
            </div>

            <div v-else class="constraint-group">
              <div class="constraint-title">
                <el-icon><Check /></el-icon>
                {{ $t('optimizationProcess.model.constraints.fixedDuration.title') }}
              </div>
              <div class="constraint-formula">
                T = {{ optimizationData.duration_constraint }} {{ $t('common.days') }}
              </div>
              <div class="constraint-desc">
                <em>{{ $t('optimizationProcess.model.constraints.fixedDuration.description') }}</em>
              </div>
            </div>

            <div class="constraint-group">
              <div class="constraint-title">
                <el-icon><Check /></el-icon>
                {{ $t('optimizationProcess.model.constraints.bounds.title') }}
              </div>
              <div class="constraint-formula">
                {{ $t('optimizationProcess.model.constraints.bounds.formula') }}
              </div>
              <div class="constraint-desc">
                <em>{{ $t('optimizationProcess.model.constraints.bounds.description') }}</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 求解過程 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.solving.title') }}</h3>
        <div class="solve-steps">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step1.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step1.description', { 
                  varCount: activities.length * 2 + 1, 
                  constraintCount: precedences.length + activities.length + 1 
                }) }}
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step2.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step2.description') }}
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step3.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step3.description') }}
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step4.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step4.description') }}
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">5</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step5.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step5.description') }}
                <ul>
                  <li>{{ $t('optimizationProcess.solving.step5.items[0]') }}</li>
                  <li>{{ $t('optimizationProcess.solving.step5.items[1]') }}</li>
                  <li>{{ $t('optimizationProcess.solving.step5.items[2]') }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">6</div>
            <div class="step-content">
              <div class="step-title">{{ $t('optimizationProcess.solving.step6.title') }}</div>
              <div class="step-desc">
                {{ $t('optimizationProcess.solving.step6.description') }}
                <ul>
                  <li>{{ $t('optimizationProcess.solving.step6.items[0]') }}</li>
                  <li>{{ $t('optimizationProcess.solving.step6.items[1]') }}</li>
                  <li>{{ $t('optimizationProcess.solving.step6.items[2]') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 求解時間 -->
        <div class="solve-result">
          <el-icon><Clock /></el-icon>
          <span class="result-text">
            {{ $t('optimizationProcess.solving.completionTime') }}<strong>{{ (result.calculation_time * 1000).toFixed(2) }} {{ $t('optimizationProcess.solving.milliseconds') }}</strong>
          </span>
        </div>
      </div>

      <!-- 最優解詳細結果 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.results.title') }}</h3>
        
        <!-- 工期結果 -->
        <div class="result-box">
          <div class="result-item primary">
            <span class="result-label">{{ $t('optimizationProcess.results.optimalDuration') }}</span>
            <span class="result-value">{{ result.optimal_duration }} {{ $t('common.days') }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('optimizationProcess.results.directCost') }}</span>
            <span class="result-value">{{ formatCurrency(result.optimal_cost) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('optimizationProcess.results.indirectCost') }}</span>
            <span class="result-value">{{ formatCurrency(result.indirect_cost) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('optimizationProcess.results.penalty') }}</span>
            <span class="result-value">{{ formatCurrency(result.penalty_amount) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('optimizationProcess.results.bonus') }}</span>
            <span class="result-value">{{ formatCurrency(result.bonus_amount) }}</span>
          </div>
          <div class="result-item total">
            <span class="result-label">{{ $t('optimizationProcess.results.totalCost') }}</span>
            <span class="result-value">{{ formatCurrency(result.total_cost) }}</span>
          </div>
        </div>

        <!-- 作業趕工決策 -->
        <div class="decision-table">
          <h4 class="subsection-title">{{ $t('optimizationProcess.results.decisions.title') }}</h4>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">{{ $t('optimizationProcess.results.decisions.normal') }}</span>
              <span class="stat-value">{{ normalCount }} {{ $t('optimizationProcess.results.decisions.activities') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ $t('optimizationProcess.results.decisions.crashed') }}</span>
              <span class="stat-value">{{ crashedCount }} {{ $t('optimizationProcess.results.decisions.activities') }}</span>
            </div>
          </div>
          <el-table :data="schedules" stripe border class="schedule-table">
            <el-table-column prop="activity_name" :label="$t('optimizationProcess.results.decisions.activityName')" width="200" />
            <el-table-column :label="$t('optimizationProcess.results.decisions.startTime')" width="120" align="center">
              <template #default="{ row }">
                {{ $t('optimizationProcess.results.decisions.day', { day: row.start_time }) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('optimizationProcess.results.decisions.endTime')" width="120" align="center">
              <template #default="{ row }">
                {{ $t('optimizationProcess.results.decisions.day', { day: row.end_time }) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('optimizationProcess.results.decisions.duration')" width="100" align="center">
              <template #default="{ row }">
                {{ $t('optimizationProcess.results.decisions.days', { days: row.duration }) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('optimizationProcess.results.decisions.decision')" width="130" align="center">
              <template #default="{ row }">
                <el-tag :type="row.is_crashed ? 'warning' : 'success'" class="decision-tag">
                  {{ row.is_crashed ? $t('optimizationProcess.results.decisions.decisionCrashed') : $t('optimizationProcess.results.decisions.decisionNormal') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('optimizationProcess.results.decisions.cost')" align="right">
              <template #default="{ row }">
                <span class="cost-text">{{ formatCurrency(row.cost) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 成本計算明細 -->
        <div class="cost-breakdown">
          <h4 class="subsection-title">{{ $t('optimizationProcess.results.breakdown.title') }}</h4>
          <div class="calculation-steps">
            <div class="calc-step">
              <span class="calc-label">{{ $t('optimizationProcess.results.breakdown.directCostLabel') }}</span>
              <span class="calc-formula">
                Σ [{{ $t('optimizationProcess.results.breakdown.directCostLabel') }}] = 
                <template v-for="(schedule, idx) in schedules" :key="schedule.activity_id">
                  {{ formatCurrency(schedule.cost) }}<template v-if="idx < schedules.length - 1"> + </template>
                </template>
                = <strong>{{ formatCurrency(result.optimal_cost) }}</strong>
              </span>
            </div>
            <div class="calc-step">
              <span class="calc-label">{{ $t('optimizationProcess.results.breakdown.indirectCostLabel') }}</span>
              <span class="calc-formula">
                {{ formatCurrency(optimizationData.indirect_cost) }} × {{ result.optimal_duration }} {{ $t('common.days') }}
                = <strong>{{ formatCurrency(result.indirect_cost) }}</strong>
              </span>
            </div>
            <div v-if="result.penalty_amount > 0" class="calc-step penalty">
              <span class="calc-label">{{ $t('optimizationProcess.results.breakdown.penaltyLabel') }}</span>
              <span class="calc-formula">
                <template v-if="optimizationData.penalty_type === 'fixed' && optimizationData.penalty_amount">
                  {{ $t('optimizationProcess.results.breakdown.penaltyFixed') }}
                  <br>
                  = {{ formatCurrency(optimizationData.penalty_amount) }} × {{ result.optimal_duration - optimizationData.target_duration }} {{ $t('common.days') }}
                </template>
                <template v-else-if="optimizationData.penalty_type === 'rate' && optimizationData.penalty_rate">
                  {{ $t('optimizationProcess.results.breakdown.penaltyRate') }}
                  <br>
                  = {{ formatCurrency(optimizationData.contract_amount) }} × {{ (Number(optimizationData.penalty_rate) * 100).toFixed(2) }}% × {{ result.optimal_duration - optimizationData.target_duration }} {{ $t('common.days') }}
                </template>
                = <strong>{{ formatCurrency(result.penalty_amount) }}</strong>
                <span v-if="optimizationData.contract_amount && Number(result.penalty_amount) >= Number(optimizationData.contract_amount) * 0.2" style="color: #EF4444;">
                  {{ $t('optimizationProcess.results.breakdown.capReached', { percent: 20 }) }}
                </span>
              </span>
            </div>
            <div v-if="result.bonus_amount > 0" class="calc-step bonus">
              <span class="calc-label">{{ $t('optimizationProcess.results.breakdown.bonusLabel') }}</span>
              <span class="calc-formula">
                {{ $t('optimizationProcess.results.breakdown.bonusFormula') }}
                <br>
                <template v-if="optimizationData.contract_amount && optimizationData.contract_duration">
                  = {{ formatCurrency(optimizationData.contract_amount) }} × {{ optimizationData.target_duration - result.optimal_duration }} ÷ {{ optimizationData.contract_duration }} × 5%
                  = <strong>{{ formatCurrency(result.bonus_amount) }}</strong>
                  <span v-if="Number(result.bonus_amount) >= Number(optimizationData.contract_amount) * 0.01" style="color: #F59E0B;">
                    {{ $t('optimizationProcess.results.breakdown.capReached', { percent: 1 }) }}
                  </span>
                </template>
                <template v-else>
                  = <strong>{{ formatCurrency(result.bonus_amount) }}</strong>
                </template>
              </span>
            </div>
            <div class="calc-step total">
              <span class="calc-label">{{ $t('optimizationProcess.results.breakdown.totalLabel') }}</span>
              <span class="calc-formula">
                {{ formatCurrency(result.optimal_cost) }} + {{ formatCurrency(result.indirect_cost) }}
                <template v-if="result.penalty_amount > 0"> + {{ formatCurrency(result.penalty_amount) }}</template>
                <template v-if="result.bonus_amount > 0"> - {{ formatCurrency(result.bonus_amount) }}</template>
                = <strong class="highlight">{{ formatCurrency(result.total_cost) }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最優性證明 -->
      <div class="section">
        <h3 class="section-title">{{ $t('optimizationProcess.optimality.title') }}</h3>
        <div class="content-box optimality">
          <div class="optimality-item">
            <el-icon class="icon-success"><CircleCheck /></el-icon>
            <div class="optimality-content">
              <strong>{{ $t('optimizationProcess.optimality.global.title') }}</strong>
              {{ $t('optimizationProcess.optimality.global.description') }}
            </div>
          </div>
          <div class="optimality-item">
            <el-icon class="icon-success"><CircleCheck /></el-icon>
            <div class="optimality-content">
              <strong>{{ $t('optimizationProcess.optimality.feasibility.title') }}</strong>
              {{ $t('optimizationProcess.optimality.feasibility.description') }}
            </div>
          </div>
          <div class="optimality-item">
            <el-icon class="icon-success"><CircleCheck /></el-icon>
            <div class="optimality-content">
              <strong>{{ $t('optimizationProcess.optimality.optimal.title') }}</strong>
              {{ optimizationData.mode === 'budget_to_duration' 
                ? $t('optimizationProcess.optimality.optimal.descriptionDuration') 
                : $t('optimizationProcess.optimality.optimal.descriptionCost') 
              }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Clock, CircleCheck } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  optimizationData: {
    type: Object,
    required: true
  },
  activities: {
    type: Array,
    required: true
  },
  precedences: {
    type: Array,
    required: true
  }
})

// 計算統計數據
const schedules = computed(() => props.result.schedules || [])

const normalCount = computed(() => {
  return schedules.value.filter(s => !s.is_crashed).length
})

const crashedCount = computed(() => {
  return schedules.value.filter(s => s.is_crashed).length
})

// 格式化貨幣
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// 根據 ID 獲取作業名稱
const getActivityName = (activityId) => {
  const activity = props.activities.find(a => a.id === activityId)
  return activity ? activity.name : activityId
}
</script>

<style scoped>
.optimization-process {
  margin-top: 24px;
}

.process-card {
  border: 1px solid var(--border-color);
  border-radius: 0;
  box-shadow: none;
}

.process-card :deep(.el-card__header) {
  background-color: #F9FAFB;
  border-bottom: 2px solid var(--border-color);
  padding: 20px 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 區段樣式 */
.section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-light);
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid var(--primary);
}

.subsection {
  margin-bottom: 24px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

/* 內容框 */
.content-box {
  background-color: #F9FAFB;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 20px;
  line-height: 1.8;
}

.content-box p {
  margin: 0 0 8px 0;
}

.content-box .description {
  color: var(--text-secondary);
  margin-top: 8px;
}

/* 模式標籤 */
.mode-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 0;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 16px;
}

.mode-badge.mode-budget_to_duration {
  background-color: #EEF2FF;
  color: #4F46E5;
  border: 1px solid #C7D2FE;
}

.mode-badge.mode-duration_to_cost {
  background-color: #F0FDF4;
  color: #16A34A;
  border: 1px solid #BBF7D0;
}

/* 約束列表 */
.constraints-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.constraint-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.constraint-label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 120px;
}

.constraint-value {
  color: var(--text-primary);
  font-weight: 600;
}

/* 公式框 */
.formula-box {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 20px;
  margin-bottom: 16px;
}

.formula-item {
  display: flex;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.formula-item:last-child {
  border-bottom: none;
}

.formula-var {
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  min-width: 60px;
}

.formula-desc {
  color: var(--text-secondary);
  line-height: 1.6;
}

.variable-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.variable-details ul {
  margin: 8px 0 0 0;
  padding-left: 24px;
}

.variable-details li {
  color: var(--text-secondary);
  line-height: 1.8;
}

/* 目標函數 */
.objective-formula {
  line-height: 1.8;
}

.formula-line {
  font-size: 16px;
  padding: 12px 0;
  color: var(--text-primary);
}

.formula-explanation {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.formula-explanation ul {
  margin: 8px 0;
  padding-left: 24px;
}

.formula-explanation li {
  margin: 8px 0;
  line-height: 1.8;
  color: var(--text-secondary);
}

.calc-value {
  color: var(--primary);
  font-weight: 600;
  margin-left: 8px;
}

.total-calc {
  margin-top: 16px;
  padding: 16px;
  background-color: #F0F9FF;
  border: 1px solid #BAE6FD;
  border-radius: 0;
  font-size: 15px;
  line-height: 1.8;
}

.total-calc .highlight {
  color: #DC2626;
  font-size: 18px;
  font-weight: 700;
}

/* 限制式框 */
.constraints-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.constraint-group {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 16px;
}

.constraint-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.constraint-title .el-icon {
  color: #10B981;
}

.constraint-formula {
  font-family: 'Times New Roman', serif;
  font-size: 15px;
  padding: 12px;
  background-color: #F9FAFB;
  border-left: 3px solid var(--primary);
  margin-bottom: 8px;
}

.constraint-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
}

.constraint-example {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.example-item {
  padding: 4px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.more-info {
  color: var(--text-tertiary);
  font-style: italic;
  margin-top: 8px;
}

/* 求解步驟 */
.solve-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  gap: 16px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 20px;
}

.step-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary);
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
  border-radius: 50%;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.step-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 14px;
}

.step-desc ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.step-desc li {
  margin: 4px 0;
}

.solve-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 0;
}

.solve-result .el-icon {
  font-size: 20px;
  color: #16A34A;
}

.result-text {
  color: var(--text-primary);
  font-size: 15px;
}

/* 結果框 */
.result-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #F9FAFB;
  border: 1px solid var(--border-color);
  border-radius: 0;
}

.result-item.primary {
  background-color: #EEF2FF;
  border-color: #C7D2FE;
}

.result-item.total {
  grid-column: 1 / -1;
  background-color: #FEF2F2;
  border-color: #FECACA;
}

.result-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.result-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.result-item.total .result-value {
  color: #DC2626;
  font-size: 24px;
}

/* 決策表格 */
.decision-table {
  margin-top: 24px;
}

.stats-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F9FAFB;
  border: 1px solid var(--border-color);
  border-radius: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  color: var(--text-primary);
  font-weight: 600;
}

.schedule-table {
  border-radius: 0;
}

.schedule-table :deep(th) {
  background-color: #F9FAFB;
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 0;
}

.decision-tag {
  border-radius: 0;
  font-weight: 500;
}

.cost-text {
  font-weight: 600;
  color: var(--text-primary);
}

/* 成本明細 */
.cost-breakdown {
  margin-top: 24px;
}

.calculation-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calc-step {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #F9FAFB;
  border: 1px solid var(--border-color);
  border-radius: 0;
}

.calc-step.penalty {
  background-color: #FEF2F2;
  border-color: #FECACA;
}

.calc-step.bonus {
  background-color: #F0FDF4;
  border-color: #BBF7D0;
}

.calc-step.total {
  background-color: #FFF7ED;
  border: 2px solid #FDBA74;
}

.calc-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
}

.calc-formula {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  font-family: 'Times New Roman', serif;
}

.calc-formula strong {
  color: var(--text-primary);
  font-weight: 700;
}

.calc-step.total .calc-formula {
  font-size: 16px;
}

.calc-step.total .highlight {
  color: #DC2626;
  font-size: 20px;
}

/* 最優性保證 */
.content-box.optimality {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.optimality-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.icon-success {
  color: #10B981;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.optimality-content {
  flex: 1;
  line-height: 1.8;
  color: var(--text-secondary);
}

.optimality-content strong {
  color: var(--text-primary);
}
</style>

