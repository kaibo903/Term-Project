# 逾期違約金計算問題修復

## 問題描述

用戶報告：已經輸入了逾期違約金參數，但在結果中顯示為「NT$ 0」。

## 問題原因

**違約金計算需要「目標工期」作為判斷基準**。

### 邏輯說明

1. **違約金的計算邏輯**：
   ```
   如果：最優工期 > 目標工期
   則：計算違約金 = 違約金率/金額 × 延遲天數
   否則：違約金 = 0（沒有逾期）
   ```

2. **缺少目標工期的問題**：
   - 如果用戶只輸入了違約金金額或比例
   - 但沒有輸入目標工期
   - 系統無法判斷是否逾期
   - **結果：違約金永遠為 0**

### 程式碼位置

**後端計算邏輯** (`backend/app/models/bidding_optimizer.py`，第 299-311 行)：

```python
calculated_penalty = Decimal("0.0")
...
if target_duration:  # ⚠️ 如果沒有目標工期，這個區塊不會執行
    if optimal_duration > target_duration:
        overdue_days = optimal_duration - target_duration
        if penalty_type == "fixed" and penalty_amount:
            calculated_penalty = penalty_amount * overdue_days
        elif penalty_type == "rate" and penalty_rate and contract_amount:
            daily_penalty = penalty_rate * contract_amount
            calculated_penalty = daily_penalty * overdue_days
        ...
```

## 解決方案

### 1. 添加前端表單驗證

當用戶輸入違約金參數時，強制要求輸入目標工期。

**修改文件**：`src/views/BiddingOptimization.vue`

#### (1) 添加驗證規則

```javascript
target_duration: [
  {
    validator: (rule, value, callback) => {
      // 如果設定了違約金（固定金額或比例），則必須輸入目標工期
      const hasPenalty = (optimizationForm.value.penalty_amount && optimizationForm.value.penalty_amount > 0) || 
                        (optimizationForm.value.penalty_rate && optimizationForm.value.penalty_rate > 0)
      if (hasPenalty && !value) {
        callback(new Error(t('optimization.validation.targetDurationRequired')))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]
```

#### (2) 目標工期欄位添加必填標記

```vue
<label class="item-label">
  {{ $t('optimization.targetDuration') }}
  <!-- 當設定了違約金時顯示紅色星號 -->
  <span v-if="(optimizationForm.penalty_amount && optimizationForm.penalty_amount > 0) || 
              (optimizationForm.penalty_rate && optimizationForm.penalty_rate > 0)" 
        style="color: #F56C6C;">*</span>
</label>
<el-form-item prop="target_duration" class="form-item-wrapper">
  ...
</el-form-item>
```

### 2. 添加多語言錯誤訊息

**中文** (`src/i18n/locales/zh-TW.js`)：

```javascript
validation: {
  ...
  targetDurationRequired: '設定逾期違約金時，必須輸入目標工期'
}
```

**英文** (`src/i18n/locales/en-US.js`)：

```javascript
validation: {
  ...
  targetDurationRequired: 'Target duration is required when penalty is set'
}
```

## 修復效果

### 修復前

1. 用戶輸入違約金金額：`NT$ 10,000 / 天`
2. 未輸入目標工期
3. 執行計算
4. ❌ **結果顯示違約金：NT$ 0**（無法判斷是否逾期）

### 修復後

1. 用戶輸入違約金金額：`NT$ 10,000 / 天`
2. 未輸入目標工期
3. 點擊「開始計算」
4. ✅ **表單驗證失敗：「設定逾期違約金時，必須輸入目標工期」**
5. 用戶補充輸入目標工期：`60 天`
6. 執行計算
7. ✅ **結果正確顯示違約金：NT$ 50,000**（假設最優工期為 65 天，延遲 5 天）

## 使用指南

### 正確的輸入順序

如果要計算逾期違約金：

1. **必填項目**：
   - ✅ 目標工期（例如：60 天）
   - ✅ 違約金類型（固定金額 或 按比例）
   - ✅ 違約金金額/比例（例如：NT$ 10,000 / 天 或 0.01%）

2. **相關項目**：
   - 合約總價（計算違約金上限：20%）
   - 合約工期（計算趕工獎金）

### 違約金計算公式

#### 固定金額方式

```
違約金 = 每日違約金額 × 延遲天數
```

**範例**：
- 每日違約金：NT$ 10,000
- 目標工期：60 天
- 實際工期：65 天
- **違約金 = NT$ 10,000 × 5 = NT$ 50,000**

#### 按比例方式

```
違約金 = 合約總價 × 違約金率 × 延遲天數
```

**範例**：
- 合約總價：NT$ 10,000,000
- 違約金率：0.01% (0.0001)
- 目標工期：60 天
- 實際工期：65 天
- **違約金 = NT$ 10,000,000 × 0.0001 × 5 = NT$ 5,000**

### 違約金上限

根據工程慣例，**違約金上限為合約總價的 20%**。

**範例**：
- 合約總價：NT$ 10,000,000
- 違約金上限：NT$ 2,000,000
- 即使計算結果超過此數額，系統也會自動限制在上限內

## 技術說明

### 驗證觸發時機

- 當用戶在「目標工期」欄位失焦時 (`trigger: 'blur'`)
- 當用戶點擊「開始計算」按鈕時（表單整體驗證）

### 動態必填標記

使用 Vue 的響應式特性，當用戶輸入違約金參數時，自動在「目標工期」標籤後顯示紅色星號（*），提示該欄位變為必填。

### 相容性

- ✅ 向後相容：不影響現有功能
- ✅ 不影響不使用違約金的情況
- ✅ 中英文雙語支援

## 測試步驟

### 測試案例 1：設定違約金但未輸入目標工期

1. 選擇專案
2. 選擇優化模式（任一種）
3. 輸入預算/工期限制
4. **輸入違約金金額：NT$ 10,000**
5. **不輸入目標工期**
6. 點擊「開始計算」
7. ✅ **預期結果：顯示錯誤訊息「設定逾期違約金時，必須輸入目標工期」**

### 測試案例 2：完整輸入所有參數

1. 選擇專案
2. 選擇優化模式
3. 輸入預算/工期限制
4. 輸入違約金金額：NT$ 10,000
5. **輸入目標工期：60 天**
6. 輸入合約總價：NT$ 10,000,000
7. 輸入合約工期：100 天
8. 點擊「開始計算」
9. ✅ **預期結果：計算成功，違約金顯示正確金額（如果最優工期 > 60 天）**

### 測試案例 3：不使用違約金

1. 選擇專案
2. 選擇優化模式
3. 輸入預算/工期限制
4. **不輸入違約金**
5. 不輸入目標工期
6. 點擊「開始計算」
7. ✅ **預期結果：計算成功，違約金為 NT$ 0（正常行為）**

## 相關文件

- **後端邏輯**：`backend/app/models/bidding_optimizer.py`
- **前端表單**：`src/views/BiddingOptimization.vue`
- **語言包**：
  - `src/i18n/locales/zh-TW.js`
  - `src/i18n/locales/en-US.js`

## 版本記錄

- **修復日期**：2025年1月6日
- **版本**：v2.0.1
- **影響範圍**：投標最佳化決策表單驗證
- **修復類型**：Bug 修復 + 用戶體驗改善

---

**總結**：這個修復確保了用戶在設定違約金時，必須提供目標工期作為判斷基準，避免了違約金顯示為 0 的誤解，提升了系統的易用性和準確性。

