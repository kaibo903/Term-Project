# 多語言支援指南 (Internationalization Guide)

## 概述 (Overview)

本專案已完整整合 Vue I18n 多語言支援系統，提供繁體中文和英文兩種語言介面。

This project has fully integrated Vue I18n internationalization system, providing both Traditional Chinese and English interfaces.

---

## 功能特點 (Features)

### 已實現功能 (Implemented Features)

1. **完整的語言包**
   - 繁體中文 (`zh-TW`)
   - 英文 (`en-US`)

2. **語言切換器**
   - 位於頂部導航欄右上角
   - 支援即時語言切換
   - 語言偏好持久化儲存

3. **已翻譯的內容**
   - 導航選單
   - 專案管理頁面
   - 投標最佳化頁面（部分）
   - 結果分析頁面
   - 所有通用元件（按鈕、訊息等）

4. **Element Plus 整合**
   - UI 元件庫語言自動切換
   - 日期選擇器、表單驗證等均支援多語言

---

## 使用方式 (How to Use)

### 切換語言 (Switch Language)

1. 點擊頂部導航欄右上角的語言選擇器（地球圖標）
2. 選擇您想要的語言（繁體中文或 English）
3. 系統會自動刷新頁面以應用新語言設定

### 在代碼中使用 i18n (Using i18n in Code)

#### 在 Template 中使用

```vue
<template>
  <!-- 基本用法 -->
  <h1>{{ $t('nav.home') }}</h1>
  
  <!-- 帶參數 -->
  <p>{{ $t('project.deleteConfirm', { name: projectName }) }}</p>
  
  <!-- 在屬性中使用 -->
  <el-button :title="$t('common.save')">
    {{ $t('common.save') }}
  </el-button>
</template>
```

#### 在 Script 中使用

```javascript
<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 使用翻譯
const message = t('common.success')

// 使用帶參數的翻譯
const errorMsg = t('project.loadError', { error: 'Network Error' })

// 獲取或設置當前語言
console.log(locale.value) // 'zh-TW' or 'en-US'
locale.value = 'en-US' // 切換到英文
</script>
```

---

## 檔案結構 (File Structure)

```
src/
├── i18n/
│   ├── index.js              # i18n 配置檔案
│   └── locales/
│       ├── zh-TW.js          # 繁體中文語言包
│       └── en-US.js          # 英文語言包
├── main.js                   # i18n 整合
└── App.vue                   # 語言切換器
```

---

## 語言包結構 (Language Pack Structure)

語言包採用巢狀物件結構，便於組織和管理翻譯文字：

```javascript
export default {
  // 通用文字
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    // ...
  },
  
  // 導航
  nav: {
    home: 'Home',
    projectManagement: 'Project Management',
    // ...
  },
  
  // 專案管理
  project: {
    title: 'Project Management',
    create: 'Create Project',
    // ...
  },
  
  // 其他模組...
}
```

---

## 添加新翻譯 (Adding New Translations)

### 步驟 1: 添加翻譯鍵值

在 `src/i18n/locales/zh-TW.js` 和 `src/i18n/locales/en-US.js` 中添加對應的翻譯：

**zh-TW.js:**
```javascript
export default {
  // ...
  myModule: {
    title: '我的模組',
    description: '這是描述'
  }
}
```

**en-US.js:**
```javascript
export default {
  // ...
  myModule: {
    title: 'My Module',
    description: 'This is description'
  }
}
```

### 步驟 2: 在組件中使用

```vue
<template>
  <div>
    <h1>{{ $t('myModule.title') }}</h1>
    <p>{{ $t('myModule.description') }}</p>
  </div>
</template>
```

---

## 待完成項目 (Todo Items)

以下組件和頁面需要進一步翻譯：

### 1. ActivityTable.vue
需要翻譯的內容：
- 表格欄位標籤
- 表單欄位提示
- CSV 匯入對話框
- 驗證錯誤訊息

### 2. BiddingOptimization.vue
需要完善翻譯的部分：
- 所有表單標籤
- 計算說明彈窗
- 結果顯示文字
- 驗證規則訊息

### 3. OptimizationProcess.vue
需要翻譯：
- MILP 數學模型說明
- 公式解釋
- 步驟說明
- 結論與建議

### 4. GanttChart.vue 和 CostChart.vue
需要翻譯：
- 圖表標題
- 軸標籤
- 圖例文字

### 5. Utils (pdfGenerator.js, excelGenerator.js)
需要翻譯：
- 匯出檔案中的標題和標籤

---

## 翻譯指南 (Translation Guidelines)

### 一般原則

1. **保持一致性**: 相同概念使用相同的翻譯
2. **簡潔明瞭**: 避免過於冗長的翻譯
3. **專業術語**: 保持專業術語的準確性
4. **上下文**: 考慮翻譯在實際使用場景中的意義

### 常用術語翻譯對照

| 繁體中文 | English |
|---------|---------|
| 專案 | Project |
| 作業 | Activity |
| 工期 | Duration |
| 成本 | Cost |
| 趕工 | Crash |
| 最佳化 | Optimization |
| 違約金 | Penalty |
| 獎金 | Bonus |
| 契約 | Contract |
| 排程 | Schedule |

---

## 測試多語言功能 (Testing I18n)

### 測試清單

- [ ] 切換語言後，所有可見文字均正確翻譯
- [ ] 表單驗證訊息顯示正確語言
- [ ] Element Plus 組件（日期選擇器、分頁等）語言正確
- [ ] 錯誤訊息和提示均使用正確語言
- [ ] 匯出的 PDF/Excel 使用正確語言
- [ ] 刷新頁面後語言設定保持不變

### 測試步驟

1. 在繁體中文模式下瀏覽所有頁面
2. 切換到英文模式
3. 再次瀏覽所有頁面，檢查翻譯
4. 測試所有功能（建立專案、優化計算、匯出報告等）
5. 檢查錯誤訊息是否正確翻譯

---

## 疑難排解 (Troubleshooting)

### 問題：切換語言後部分內容未翻譯

**解決方案：**
1. 檢查該文字是否已添加到語言包
2. 確認使用了正確的翻譯鍵值
3. 檢查是否正確使用 `$t()` 或 `t()` 函數

### 問題：Element Plus 組件語言未切換

**解決方案：**
1. 確認 `main.js` 中正確配置了 Element Plus locale
2. 語言切換後需要刷新頁面（已實現）

### 問題：語言設定未持久化

**解決方案：**
1. 檢查 localStorage 是否正常工作
2. 確認 `app-locale` 鍵值正確儲存

---

## 貢獻指南 (Contributing)

如需添加新語言或改進現有翻譯：

1. Fork 專案
2. 創建新的語言包檔案（如 `src/i18n/locales/ja-JP.js`）
3. 在 `src/i18n/index.js` 中註冊新語言
4. 更新 App.vue 中的語言選擇器
5. 提交 Pull Request

---

## 技術細節 (Technical Details)

### 使用的套件

- **vue-i18n**: ^9.14.5
- **Element Plus Locales**: 內建支援

### 語言儲存

語言偏好儲存在 `localStorage` 中，鍵名為 `app-locale`。

### 語言切換機制

語言切換時會：
1. 更新 i18n 的 locale
2. 儲存到 localStorage
3. 刷新頁面以應用 Element Plus 語言設定

---

## 聯絡方式 (Contact)

如有任何問題或建議，請透過以下方式聯絡：

- 建立 Issue
- 提交 Pull Request
- 聯絡專案維護者

---

**最後更新：** 2025年1月

**版本：** 1.0.0

