<template>
  <div class="bidding-optimization">
    <!-- 麵包屑導航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>{{ $t('nav.home') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('nav.optimization') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 頁面標題 -->
    <div class="page-header">
      <h1 class="page-title">{{ $t('optimization.title') }}</h1>
      <p class="page-subtitle">{{ $t('optimization.subtitle') }}</p>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 左側：參數設定 -->
      <div class="settings-panel">
        <div class="panel-header-new">
          <h2 class="panel-title-new">{{ $t('optimization.settings') }}</h2>
        </div>
        
        <el-form :model="optimizationForm" :rules="rules" ref="formRef" class="optimization-form-new">
          <!-- 基本資訊區塊 -->
          <div class="form-block">
            <div class="block-title">{{ $t('optimization.basicInfo') }}</div>
            
            <div class="form-row-new form-row-two-col">
              <div class="form-item-new form-item-half">
                <label class="item-label">{{ $t('optimization.selectProject') }}</label>
                <el-form-item prop="project_id" class="form-item-wrapper">
                  <el-select
                    v-model="optimizationForm.project_id"
                    :placeholder="$t('optimization.selectProjectPlaceholder')"
                    class="select-input"
                    @change="loadProjectActivities"
                  >
                    <el-option
                      v-for="project in projects"
                      :key="project.id"
                      :label="project.name"
                      :value="project.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-item-new form-item-half">
                <label class="item-label">{{ $t('optimization.mode') }}</label>
                <el-form-item prop="mode" class="form-item-wrapper">
                  <el-radio-group 
                    v-model="optimizationForm.mode" 
                    @change="handleModeChange" 
                    class="mode-group-new"
                  >
                    <el-radio-button label="budget_to_duration">{{ $t('optimization.budgetFixed') }}</el-radio-button>
                    <el-radio-button label="duration_to_cost">{{ $t('optimization.durationFixed') }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>

            <div class="form-row-new form-row-two-col">
              <div class="form-item-new form-item-half">
                <label class="item-label">
                  {{ optimizationForm.mode === 'budget_to_duration' ? $t('optimization.budgetConstraint') : $t('optimization.durationConstraint') }}
                </label>
                <el-form-item
                  :prop="optimizationForm.mode === 'budget_to_duration' ? 'budget_constraint' : 'duration_constraint'"
                  class="form-item-wrapper"
                >
                  <el-input-number
                    v-if="optimizationForm.mode === 'budget_to_duration'"
                    v-model="optimizationForm.budget_constraint"
                    :min="0"
                    :precision="0"
                    :step="10000"
                    class="number-input"
                    :placeholder="$t('optimization.budgetPlaceholder')"
                    :controls="false"
                  >
                    <template #prefix>{{ $t('common.currency') }}</template>
                  </el-input-number>
                  <el-input-number
                    v-else
                    v-model="optimizationForm.duration_constraint"
                    :min="1"
                    :precision="0"
                    class="number-input"
                    :placeholder="$t('optimization.durationPlaceholder')"
                    :controls="false"
                  />
                </el-form-item>
              </div>
              <div class="form-item-new form-item-half">
                <label class="item-label">{{ $t('optimization.indirectCost') }}</label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.indirect_cost"
                    :min="0"
                    :precision="0"
                    :step="10000"
                    class="number-input"
                    :placeholder="$t('optimization.indirectCostPlaceholder')"
                    :controls="false"
                  >
                    <template #prefix>{{ $t('common.currency') }}</template>
                  </el-input-number>
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 獎懲設定區塊 -->
          <div class="form-block">
            <div class="block-title">{{ $t('optimization.penaltySettings') }}</div>
            
            <div class="form-row-new form-row-two-col">
              <div class="form-item-new form-item-half">
                <label class="item-label">
                  {{ $t('optimization.penaltyType') }}
                  <el-popover
                    placement="top"
                    :width="400"
                    trigger="click"
                    popper-class="calculation-popover"
                  >
                    <template #reference>
                      <el-icon class="help-icon"><QuestionFilled /></el-icon>
                    </template>
                    <div class="calculation-info">
                      <h4 class="info-title">{{ $t('optimization.penaltyCalculation.title') }}</h4>
                      <div class="info-content">
                        <p><strong>{{ $t('optimization.penaltyCalculation.fixed') }}</strong></p>
                        <p><strong>{{ $t('optimization.penaltyCalculation.rate') }}</strong></p>
                        <p class="info-note">⚠️ {{ $t('optimization.penaltyCalculation.limit') }}</p>
                      </div>
                    </div>
                  </el-popover>
                </label>
                <el-form-item class="form-item-wrapper">
                  <el-radio-group 
                    v-model="optimizationForm.penalty_type" 
                    @change="handlePenaltyTypeChange" 
                    class="penalty-group-new"
                  >
                    <el-radio-button label="fixed">{{ $t('optimization.penaltyTypeFixed') }}</el-radio-button>
                    <el-radio-button label="rate">{{ $t('optimization.penaltyTypeRate') }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="form-item-new form-item-half" v-if="optimizationForm.penalty_type === 'fixed'">
                <label class="item-label">{{ $t('optimization.penaltyAmount') }}</label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.penalty_amount"
                    :min="0"
                    :precision="0"
                    :step="1000"
                    class="number-input"
                    :placeholder="$t('optimization.penaltyAmountPlaceholder')"
                    :controls="false"
                  >
                    <template #prefix>{{ $t('common.currency') }}</template>
                  </el-input-number>
                </el-form-item>
              </div>
              <div class="form-item-new form-item-half" v-if="optimizationForm.penalty_type === 'rate'">
                <label class="item-label">{{ $t('optimization.penaltyRate') }}</label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.penalty_rate"
                    :min="0"
                    :precision="6"
                    :step="0.0001"
                    class="number-input"
                    :placeholder="$t('optimization.penaltyRatePlaceholder')"
                    :controls="false"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="form-row-new form-row-two-col">
              <div class="form-item-new form-item-half">
                <label class="item-label">{{ $t('optimization.contractAmount') }}</label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.contract_amount"
                    :min="0"
                    :precision="0"
                    :step="10000"
                    class="number-input"
                    :placeholder="$t('optimization.contractAmountPlaceholder')"
                    :controls="false"
                  >
                    <template #prefix>{{ $t('common.currency') }}</template>
                  </el-input-number>
                </el-form-item>
              </div>
              <div class="form-item-new form-item-half">
                <label class="item-label">
                  {{ $t('optimization.contractDuration') }}
                  <el-popover
                    placement="top"
                    :width="400"
                    trigger="click"
                    popper-class="calculation-popover"
                  >
                    <template #reference>
                      <el-icon class="help-icon"><QuestionFilled /></el-icon>
                    </template>
                    <div class="calculation-info">
                      <h4 class="info-title">{{ $t('optimization.bonusCalculation.title') }}</h4>
                      <div class="info-content">
                        <p><strong>{{ $t('optimization.bonusCalculation.formula') }}</strong></p>
                        <p class="formula">{{ $t('optimization.bonusCalculation.formulaText') }}</p>
                        <p class="info-example">{{ $t('optimization.bonusCalculation.example') }}</p>
                        <p class="info-example">{{ $t('optimization.bonusCalculation.exampleCalc') }}</p>
                        <p class="info-note">⚠️ {{ $t('optimization.bonusCalculation.limit') }}</p>
                      </div>
                    </div>
                  </el-popover>
                </label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.contract_duration"
                    :min="1"
                    :precision="0"
                    class="number-input"
                    :placeholder="$t('optimization.contractDurationPlaceholder')"
                    :controls="false"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="form-row-new">
              <div class="form-item-new">
                <label class="item-label">{{ $t('optimization.targetDuration') }}</label>
                <el-form-item class="form-item-wrapper">
                  <el-input-number
                    v-model="optimizationForm.target_duration"
                    :min="1"
                    :precision="0"
                    class="number-input"
                    :placeholder="$t('optimization.targetDurationPlaceholder')"
                    :controls="false"
                  />
                </el-form-item>
              </div>
            </div>

          </div>

          <!-- 操作按鈕 -->
          <div class="form-actions-new">
            <el-button 
              type="primary"
              @click="runOptimization" 
              :loading="optimizing" 
              class="submit-btn-new"
            >
              <el-icon v-if="!optimizing"><Search /></el-icon>
              {{ optimizing ? $t('optimization.calculating') : $t('optimization.calculate') }}
            </el-button>
            <el-button 
              @click="resetForm" 
              class="reset-btn-new"
              :disabled="optimizing"
            >
              {{ $t('common.reset') }}
            </el-button>
          </div>
        </el-form>
      </div>

      <!-- 右側：計算結果 -->
      <div class="results-panel">
        <div class="panel-header-new">
          <h2 class="panel-title-new">{{ $t('optimization.results') }}</h2>
        </div>
        
        <div v-if="optimizationResult" class="results-content">

          <!-- 關鍵指標 -->
          <div class="metrics-grid-new">
            <div class="metric-item-new primary">
              <div class="metric-label-new">{{ $t('optimization.optimalDuration') }}</div>
              <div class="metric-value-new">{{ optimizationResult.optimal_duration }}</div>
              <div class="metric-unit-new">{{ $t('common.days') }}</div>
            </div>
            <div class="metric-item-new">
              <div class="metric-label-new">{{ $t('optimization.directCost') }}</div>
              <div class="metric-value-new">{{ formatCurrency(optimizationResult.optimal_cost) }}</div>
            </div>
            <div class="metric-item-new">
              <div class="metric-label-new">{{ $t('optimization.indirectCostTotal') }}</div>
              <div class="metric-value-new">{{ formatCurrency(optimizationResult.indirect_cost || 0) }}</div>
            </div>
            <div class="metric-item-new highlight">
              <div class="metric-label-new">{{ $t('optimization.totalCost') }}</div>
              <div class="metric-value-new">{{ formatCurrency(optimizationResult.total_cost) }}</div>
              <div class="metric-note-new">{{ $t('optimization.totalCostNote') }}</div>
            </div>
          </div>

          <!-- 獎懲資訊 -->
          <div class="summary-section-new">
            <div class="summary-item-new">
              <div class="summary-label-new">{{ $t('optimization.penaltyAmount') }}</div>
              <div class="summary-value-new">{{ formatCurrency(optimizationResult.penalty_amount) }}</div>
              <div v-if="optimizationForm.contract_amount > 0" class="summary-hint-new">
                {{ $t('optimization.penaltyLimit', { amount: formatCurrency(optimizationForm.contract_amount * 0.2) }) }}
              </div>
            </div>
            <div class="summary-item-new">
              <div class="summary-label-new">{{ $t('optimization.bonusAmount') }}</div>
              <div class="summary-value-new">{{ formatCurrency(optimizationResult.bonus_amount) }}</div>
              <div v-if="optimizationForm.contract_amount > 0 && optimizationForm.contract_duration" class="summary-hint-new">
                {{ $t('optimization.bonusLimit', { amount: formatCurrency(optimizationForm.contract_amount * 0.01) }) }}
              </div>
            </div>
          </div>

          <!-- 結果摘要 -->
          <div class="calculation-info-card" v-if="optimizationResult">
            <div class="section-title-new">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ $t('optimization.resultSummary') }}</span>
            </div>
            <div class="calculation-info">
              <p>
                {{ $t('optimization.summaryText') }}
              </p>

              <div class="formula">
                <div>{{ $t('optimization.costFormula.direct', { amount: formatCurrency(optimizationResult.optimal_cost) }) }}</div>
                <div>{{ $t('optimization.costFormula.indirect', { amount: formatCurrency(optimizationResult.indirect_cost) }) }}</div>
                <div>{{ $t('optimization.costFormula.penalty', { amount: formatCurrency(optimizationResult.penalty_amount) }) }}</div>
                <div>{{ $t('optimization.costFormula.bonus', { amount: formatCurrency(optimizationResult.bonus_amount) }) }}</div>
                <div class="formula-total">
                  {{ $t('optimization.costFormula.total', { amount: formatCurrency(optimizationResult.total_cost) }) }}
                </div>
              </div>

              <p>
                {{ $t('optimization.crashedActivities', { total: optimizationResult.schedules?.length || 0, crashed: crashedActivities.length }) }}
              </p>

              <div class="info-tip">
                <el-icon><QuestionFilled /></el-icon>
                <span>{{ $t('optimization.detailTip') }}</span>
              </div>
            </div>
          </div>

          <!-- 詳細資訊（使用摺疊面板） -->
          <el-collapse v-model="activeCollapse" class="result-collapse">
            <!-- 詳細作業排程 -->
            <el-collapse-item 
              v-if="optimizationResult.schedules && optimizationResult.schedules.length > 0" 
              name="schedules"
              :title="$t('optimization.scheduleDetail')"
            >
              <!-- 壓縮作業摘要 -->
              <div v-if="crashedActivities.length > 0" class="crashed-info-new">
                <div class="crashed-header-new">
                  <el-icon><Warning /></el-icon>
                  <span>{{ $t('optimization.crashedInfo', { count: crashedActivities.length }) }}</span>
                </div>
                <div class="crashed-tags-new">
                  <el-tag
                    v-for="activity in crashedActivities"
                    :key="activity.activity_id"
                    type="warning"
                    effect="plain"
                    size="small"
                  >
                    {{ activity.activity_name }}
                  </el-tag>
                </div>
              </div>

              <div class="table-container-new">
                <el-table :data="optimizationResult.schedules" class="data-table-new compact-table" border size="small">
                  <el-table-column prop="activity_name" :label="$t('optimization.activityName')" min-width="120" />
                  <el-table-column prop="start_time" :label="$t('optimization.startTime')" width="60" align="center">
                    <template #default="{ row }">{{ row.start_time }}{{ $t('common.days') }}</template>
                  </el-table-column>
                  <el-table-column prop="end_time" :label="$t('optimization.endTime')" width="60" align="center">
                    <template #default="{ row }">{{ row.end_time }}{{ $t('common.days') }}</template>
                  </el-table-column>
                  <el-table-column prop="duration" :label="$t('optimization.duration')" width="60" align="center">
                    <template #default="{ row }">{{ row.duration }}{{ $t('common.days') }}</template>
                  </el-table-column>
                  <el-table-column prop="cost" :label="$t('optimization.cost')" width="100" align="right">
                    <template #default="{ row }">{{ formatCurrency(row.cost) }}</template>
                  </el-table-column>
                  <el-table-column prop="is_crashed" :label="$t('optimization.status')" width="70" align="center">
                    <template #default="{ row }">
                      <el-tag v-if="row.is_crashed" type="warning" size="small">{{ $t('optimization.crashed') }}</el-tag>
                      <el-tag v-else type="success" size="small">{{ $t('optimization.normal') }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>

          <!-- 操作按鈕 -->
          <div class="action-section-new">
            <el-button type="primary" @click="viewDetailedResult" class="detail-btn-new">
              <el-icon><DataAnalysis /></el-icon>
              {{ $t('optimization.viewDetails') }}
            </el-button>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="empty-state-new">
          <div class="empty-icon-new">📊</div>
          <div class="empty-title-new">{{ $t('optimization.noResults') }}</div>
          <div class="empty-desc-new">{{ $t('optimization.noResultsDesc') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  TrendCharts, 
  Setting, 
  DataAnalysis, 
  Document, 
  List, 
  Warning,
  InfoFilled,
  Edit,
  QuestionFilled
} from '@element-plus/icons-vue'
import { projectAPI, optimizationAPI } from '../services/api'

const router = useRouter()
const { t } = useI18n()

const projects = ref([])
const optimizing = ref(false)
const optimizationResult = ref(null)
const formRef = ref(null)

const optimizationForm = ref({
  project_id: null,
  mode: 'budget_to_duration',
  budget_constraint: null,
  duration_constraint: null,
  indirect_cost: null,
  penalty_type: 'rate',
  penalty_amount: null,
  penalty_rate: null,
  contract_amount: null,
  contract_duration: null,
  target_duration: null
})

const rules = computed(() => ({
  project_id: [{ required: true, message: t('optimization.validation.projectRequired'), trigger: 'change' }],
  mode: [{ required: true, message: t('optimization.validation.modeRequired'), trigger: 'change' }],
  budget_constraint: [
    {
      validator: (rule, value, callback) => {
        if (optimizationForm.value.mode === 'budget_to_duration' && !value) {
          callback(new Error(t('optimization.validation.budgetRequired')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  duration_constraint: [
    {
      validator: (rule, value, callback) => {
        if (optimizationForm.value.mode === 'duration_to_cost' && !value) {
          callback(new Error(t('optimization.validation.durationRequired')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

// 載入專案列表
const loadProjects = async () => {
  try {
    projects.value = await projectAPI.getProjects()
  } catch (error) {
    ElMessage.error(t('optimization.loadProjectsError', { error: error.message }))
  }
}

// 載入專案作業（用於驗證）
const loadProjectActivities = async () => {
  // 可以在這裡載入作業以進行驗證
}

// 處理模式變更
const handleModeChange = () => {
  optimizationForm.value.budget_constraint = null
  optimizationForm.value.duration_constraint = null
}

// 處理違約金計算方式變更
const handlePenaltyTypeChange = () => {
  if (optimizationForm.value.penalty_type === 'fixed') {
    optimizationForm.value.penalty_rate = null
  } else {
    optimizationForm.value.penalty_amount = null
  }
}

// 重置表單
const resetForm = () => {
  optimizationForm.value = {
    project_id: null,
    mode: 'budget_to_duration',
    budget_constraint: null,
    duration_constraint: null,
    indirect_cost: null,
    penalty_type: 'rate',
    penalty_amount: null,
    penalty_rate: null,
    contract_amount: null,
    contract_duration: null,
    target_duration: null
  }
  optimizationResult.value = null
  if (formRef.value) {
    formRef.value.clearValidate()
  }
  ElMessage.success(t('optimization.resetSuccess'))
}

// 執行優化計算
const runOptimization = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    optimizing.value = true
    try {
      const result = await optimizationAPI.optimize(optimizationForm.value)
      optimizationResult.value = result
      ElMessage.success(t('optimization.success'))
    } catch (error) {
      ElMessage.error(t('optimization.error', { error: error.message }))
    } finally {
      optimizing.value = false
    }
  })
}

// 查看詳細結果
const viewDetailedResult = () => {
  if (optimizationResult.value?.scenario_id) {
    router.push(`/results/${optimizationResult.value.scenario_id}`)
  }
}

// 格式化貨幣（新台幣，去除小數點）
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === 0) {
    return 'NT$ 0'
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const rounded = Math.round(numValue)
  return 'NT$ ' + rounded.toLocaleString('zh-TW')
}

// 計算壓縮的作業
const crashedActivities = computed(() => {
  if (!optimizationResult.value?.schedules) return []
  return optimizationResult.value.schedules.filter(s => s.is_crashed)
})

// 摺疊面板控制
const activeCollapse = ref([])

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.bidding-optimization {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--content-bg);
  padding: var(--spacing-3xl);
}

.breadcrumb {
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

/* 頁面標題 */
.page-header {
  margin-bottom: var(--spacing-3xl);
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  padding: 0;
  letter-spacing: 0;
  line-height: 1.4;
}

.page-subtitle {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 0;
  padding: 0;
  line-height: 1.6;
  letter-spacing: 0;
  font-weight: var(--font-weight-normal);
}

/* 主要內容區域 */
.main-content {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 32px;
  align-items: start;
}

/* 設定面板 */
.settings-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}

.panel-header-new {
  padding: var(--spacing-2xl) var(--spacing-3xl);
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg);
  flex-shrink: 0;
}

.panel-title-new {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  letter-spacing: 0;
  line-height: 1.4;
}

/* 表單樣式 */
.optimization-form-new {
  padding: var(--spacing-3xl);
}

.form-block {
  margin-bottom: 32px;
}

.form-block:last-of-type {
  margin-bottom: 0;
}

.block-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.form-row-new {
  margin-bottom: 20px;
}

.form-row-new:last-child {
  margin-bottom: 0;
}

/* 兩欄布局 */
.form-row-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-item-half {
  width: 100%;
}

.form-item-new {
  width: 100%;
}

.item-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  letter-spacing: 0;
}

.help-icon {
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.help-icon:hover {
  color: var(--primary);
}

.form-item-wrapper {
  margin-bottom: 0;
}

.form-item-wrapper :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

/* 輸入框樣式 */
.select-input,
.number-input {
  width: 100%;
}

.select-input :deep(.el-input__wrapper),
.number-input :deep(.el-input__wrapper) {
  border-radius: 0;
  border: 1px solid var(--border-color);
  box-shadow: none;
  transition: all 0.25s ease;
  height: 44px;
  padding: 0 14px;
  font-size: 15px;
  background-color: var(--card-bg);
}

.select-input :deep(.el-input__wrapper:hover),
.number-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary);
  background-color: var(--content-bg);
}

.select-input :deep(.el-input.is-focus .el-input__wrapper),
.number-input :deep(.el-input-number.is-focus .el-input__wrapper) {
  border-color: var(--primary);
  box-shadow: none;
  background-color: var(--card-bg);
}

/* 單選按鈕組 */
.mode-group-new,
.penalty-group-new {
  width: 100%;
  display: flex;
  gap: 0;
}

.mode-group-new :deep(.el-radio-button),
.penalty-group-new :deep(.el-radio-button) {
  flex: 1;
}

.mode-group-new :deep(.el-radio-button__inner),
.penalty-group-new :deep(.el-radio-button__inner) {
  width: 100%;
  border-radius: 0;
  border: 1px solid var(--border-color);
  padding: 12px 14px;
  transition: all 0.25s ease;
  height: 44px;
  line-height: 20px;
  font-size: 15px;
  background-color: var(--card-bg);
}

.mode-group-new :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.mode-group-new :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.penalty-group-new :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.penalty-group-new :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.mode-group-new :deep(.el-radio-button__inner:hover),
.penalty-group-new :deep(.el-radio-button__inner:hover) {
  background: var(--content-bg);
  border-color: var(--text-secondary);
}

.mode-group-new :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner),
.penalty-group-new :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--primary);
  color: var(--text-white);
  border-color: var(--primary);
  box-shadow: 0 1px 3px rgba(52, 152, 219, 0.3);
}

/* 操作按鈕 */
.form-actions-new {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 14px;
  flex-shrink: 0;
}

.submit-btn-new {
  flex: 1;
  height: 48px;
  font-size: 15px;
  font-weight: 400;
  border-radius: 0;
  background: var(--primary);
  border: 1px solid var(--primary);
  letter-spacing: 0.02em;
  transition: all 0.25s ease;
}

.submit-btn-new:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.reset-btn-new {
  height: 48px;
  padding: 0 32px;
  font-size: 15px;
  border-radius: 0;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  background: var(--card-bg);
  letter-spacing: 0.02em;
  transition: all 0.25s ease;
}

.reset-btn-new:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
  background: var(--content-bg);
}

/* 結果面板 */
.results-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}

.results-content {
  padding: var(--spacing-3xl);
  flex: 1;
}

/* 指標網格 */
.metrics-grid-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.metric-item-new {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 28px 24px;
  text-align: center;
  transition: all 0.25s ease;
  box-shadow: none;
}

.metric-item-new:hover {
  border-color: var(--primary);
  background-color: var(--content-bg);
}

.metric-item-new.primary {
  background: var(--content-bg);
  border-color: var(--primary);
}

.metric-item-new.highlight {
  background: var(--content-bg);
  border-color: var(--success);
}

.metric-label-new {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.metric-value-new {
  font-size: 28px;
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.metric-unit-new {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.metric-note-new {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* 摘要區塊 */
.summary-section-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  padding: 28px;
  background: var(--content-bg);
  border-radius: 0;
  border: 1px solid var(--border-color);
  box-shadow: none;
}

.summary-item-new {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label-new {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value-new {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-hint-new {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 摺疊面板樣式 */
.result-collapse {
  margin-top: 28px;
}

.result-collapse :deep(.el-collapse-item__header) {
  height: 48px;
  line-height: 48px;
  font-size: 15px;
  font-weight: 400;
  padding: 0 20px;
  background: var(--card-bg);
  border-radius: 0;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  letter-spacing: 0.01em;
  transition: all 0.25s ease;
}

.result-collapse :deep(.el-collapse-item__header:hover) {
  background: var(--content-bg);
  border-color: var(--primary);
}

.result-collapse :deep(.el-collapse-item__content) {
  padding: 24px 0;
}

.result-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.result-collapse :deep(.el-collapse-item__wrap:last-child) {
  border-bottom: none;
  margin-bottom: 0;
}

/* 緊湊表格 */
.compact-table :deep(.el-table th),
.compact-table :deep(.el-table td) {
  padding: 12px 14px;
  font-size: 14px;
}

.compact-table :deep(.el-table th) {
  font-weight: 400;
  background: var(--content-bg);
}

.section-title-new .el-icon {
  font-size: 18px;
  color: var(--primary);
}

/* 壓縮作業資訊 */
.crashed-info-new {
  margin-bottom: 20px;
  padding: 16px 20px;
  background: var(--content-bg);
  border: 1px solid var(--warning);
  border-radius: 0;
  border-left: 3px solid var(--warning);
}

.crashed-header-new {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: 0.01em;
}

.crashed-header-new .el-icon {
  font-size: 18px;
  color: var(--warning);
}

.crashed-tags-new {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 表格容器 */
.table-container-new {
  width: 100%;
  overflow-x: auto;
  border-radius: 0;
  border: 1px solid var(--border-color);
}

.data-table-new {
  width: 100%;
}

.data-table-new :deep(.el-table__header) {
  background: var(--content-bg);
}

.data-table-new :deep(.el-table th) {
  background: var(--content-bg);
  color: var(--text-primary);
  font-weight: 400;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  padding: 14px 12px;
  letter-spacing: 0.01em;
}

.data-table-new :deep(.el-table td) {
  color: var(--text-primary);
  font-size: 14px;
  border-bottom: 1px solid var(--border-light);
  padding: 14px 12px;
}

.data-table-new :deep(.el-table__row:hover) {
  background: var(--sidebar-hover) !important;
}

.data-table-new :deep(.el-table) {
  border-radius: 0;
}

.data-table-new :deep(.el-table__inner-wrapper::before) {
  display: none;
}

/* 標籤樣式 - 無印風格 */
.crashed-tags-new :deep(.el-tag) {
  border-radius: 0;
  border: 1px solid var(--warning);
  background-color: var(--content-bg);
  color: var(--text-primary);
  font-weight: 400;
  font-size: 14px;
  padding: 6px 12px;
  letter-spacing: 0.01em;
}

.data-table-new :deep(.el-tag) {
  border-radius: 0;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-primary);
  font-weight: 400;
  font-size: 13px;
  padding: 4px 10px;
  letter-spacing: 0.01em;
}

.data-table-new :deep(.el-tag--success) {
  border-color: var(--success);
  background-color: var(--content-bg);
  color: var(--text-primary);
}

.data-table-new :deep(.el-tag--warning) {
  border-color: var(--warning);
  background-color: var(--content-bg);
  color: var(--text-primary);
}

/* 操作區塊 */
.action-section-new {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
  text-align: center;
  flex-shrink: 0;
}

.detail-btn-new {
  height: 40px;
  padding: 0 32px;
  font-size: 14px;
  border-radius: 0;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: all 0.25s ease;
}

/* 空狀態 */
.empty-state-new {
  padding: 100px 28px;
  text-align: center;
}

.empty-icon-new {
  font-size: 72px;
  margin-bottom: 20px;
  opacity: 0.2;
}

.empty-title-new {
  font-size: 19px;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}

.empty-desc-new {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  letter-spacing: 0.01em;
}

/* 響應式設計 */
@media (max-width: 1400px) {
  .main-content {
    grid-template-columns: 420px 1fr;
  }
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .settings-panel {
    position: static;
    max-height: none;
  }

  .metrics-grid-new {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-section-new {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .bidding-optimization-new {
    padding: 16px;
  }

  .page-title-new {
    font-size: 24px;
  }

  .metrics-grid-new {
    grid-template-columns: 1fr;
  }

  .form-actions-new {
    flex-direction: column;
  }

  .submit-btn-new,
  .reset-btn-new {
    width: 100%;
  }
}

/* 計算說明彈窗樣式 */
:deep(.calculation-popover) {
  padding: 16px;
}

.calculation-info {
  line-height: 1.8;
}

.calculation-steps {
  margin: 10px 0 8px 18px;
  padding: 0;
  font-size: 13px;
  color: #374151;
}

.calculation-steps li {
  margin-bottom: 4px;
}

.highlight-text {
  color: #B04A3F;
  font-weight: 600;
}

.advanced-title {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.advanced-steps {
  margin: 6px 0 8px 18px;
  padding: 0;
  font-size: 13px;
  color: #374151;
}

.advanced-steps li {
  margin-bottom: 4px;
}

.formula {
  background: #F3F4F6;
  padding: 10px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  color: #1F2937;
  margin: 10px 0 4px 0;
  border-left: 3px solid #3B82F6;
  font-size: 13px;
}

.formula-total {
  margin-top: 6px;
}

.info-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 0;
}

.info-tip .el-icon {
  color: #3B82F6;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-tip span {
  flex: 1;
  font-size: 14px;
  color: #1E40AF;
  line-height: 1.6;
}

.calculation-info-card {
  margin-bottom: 24px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0;
  padding: 20px;
}

.calculation-info-card .section-title-new {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.calculation-info-card .section-title-new .el-icon {
  color: var(--primary);
}

.calculation-info p {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
