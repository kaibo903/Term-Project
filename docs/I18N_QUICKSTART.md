# 多語言功能快速開始

## 🚀 5分鐘快速體驗

### 步驟 1: 啟動應用程式

```bash
# 安裝依賴（如果尚未安裝）
npm install

# 啟動開發伺服器
npm run dev
```

### 步驟 2: 開啟瀏覽器

訪問: `http://localhost:5173`

### 步驟 3: 切換語言

1. 在頁面右上角找到 **🌐 地球圖標**
2. 點擊圖標，會出現語言選單：
   - 繁體中文
   - English
3. 選擇 **English**
4. 頁面會自動重新載入
5. 現在所有介面都是英文了！ 🎉

### 步驟 4: 測試功能

嘗試以下操作以體驗多語言：

1. **導航選單**
   - 點擊 "Project Management"
   - 點擊 "Schedule Cost Optimization"

2. **建立專案**
   - 點擊 "Create Project"
   - 查看對話框標題和表單標籤

3. **查看訊息**
   - 嘗試建立一個空專案
   - 觀察錯誤訊息是否為英文

4. **切換回中文**
   - 再次點擊 🌐 圖標
   - 選擇 "繁體中文"
   - 確認介面恢復中文

---

## 📋 測試清單

完整的多語言功能測試：

### 基本功能
- [ ] 語言選擇器顯示正常
- [ ] 點擊可展開語言選單
- [ ] 當前語言有視覺標示
- [ ] 切換語言後頁面重新載入

### 專案管理頁面
- [ ] 頁面標題翻譯正確
- [ ] 麵包屑導航翻譯正確
- [ ] "Create Project" 按鈕翻譯正確
- [ ] 表格欄位標題翻譯正確
- [ ] 建立/編輯對話框翻譯正確
- [ ] 表單標籤翻譯正確
- [ ] 狀態標籤翻譯正確
- [ ] 操作按鈕翻譯正確

### 投標最佳化頁面
- [ ] 頁面標題和副標題翻譯正確
- [ ] 參數設定區塊翻譯正確
- [ ] 表單標籤翻譯正確
- [ ] 計算按鈕翻譯正確
- [ ] 結果顯示翻譯正確

### 結果分析頁面
- [ ] 頁面標題翻譯正確
- [ ] 匯出按鈕翻譯正確
- [ ] 結果摘要翻譯正確
- [ ] 圖表標題翻譯正確
- [ ] 表格欄位翻譯正確

### 訊息與提示
- [ ] 成功訊息翻譯正確
- [ ] 錯誤訊息翻譯正確
- [ ] 警告訊息翻譯正確
- [ ] 確認對話框翻譯正確
- [ ] 表單驗證訊息翻譯正確

### Element Plus 元件
- [ ] 日期選擇器語言正確
- [ ] 分頁元件語言正確
- [ ] 空狀態提示語言正確
- [ ] 下拉選單語言正確

### 持久化
- [ ] 重新載入頁面後語言保持
- [ ] 開新分頁語言保持
- [ ] 清除 localStorage 後恢復預設語言

---

## 🐛 常見問題解決

### 問題 1: 語言選擇器沒有顯示

**可能原因：**
- App.vue 未正確更新
- Globe 圖標未正確導入

**解決方案：**
```bash
# 確認 App.vue 已包含語言選擇器代碼
# 重新啟動開發伺服器
npm run dev
```

### 問題 2: 切換語言後部分文字未翻譯

**可能原因：**
- 該文字尚未加入語言包
- 組件未使用 i18n

**解決方案：**
- 查看 `docs/CHANGELOG_I18N.md` 中的「待完善項目」
- 這是正常的，部分組件還在持續完善中

### 問題 3: Element Plus 元件語言未切換

**可能原因：**
- main.js 配置問題

**解決方案：**
```bash
# 確認 main.js 包含 Element Plus locale 配置
# 語言切換後必須重新載入頁面
```

### 問題 4: 語言設定未儲存

**可能原因：**
- 瀏覽器 localStorage 被禁用
- 隱私模式/無痕模式

**解決方案：**
- 使用正常瀏覽器模式
- 檢查瀏覽器設定允許 localStorage

---

## 📚 延伸閱讀

想要了解更多？

- **詳細文件**: [I18N Guide](./I18N_GUIDE.md)
- **更新日誌**: [Changelog](./CHANGELOG_I18N.md)
- **英文 README**: [README.en.md](../README.en.md)

---

## 💡 開發提示

### 在程式碼中使用 i18n

**Template 中使用：**
```vue
<template>
  <!-- 基本用法 -->
  <h1>{{ $t('nav.home') }}</h1>
  
  <!-- 帶變數 -->
  <p>{{ $t('project.deleteConfirm', { name: 'My Project' }) }}</p>
  
  <!-- 在屬性中 -->
  <el-button :title="$t('common.save')">
    {{ $t('common.save') }}
  </el-button>
</template>
```

**Script 中使用：**
```javascript
<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 翻譯文字
const title = t('project.title')

// 帶參數的翻譯
const message = t('project.deleteConfirm', { name: projectName })

// 查看當前語言
console.log(locale.value) // 'zh-TW' 或 'en-US'

// 程式切換語言（不建議，應使用語言選擇器）
locale.value = 'en-US'
</script>
```

### 新增翻譯鍵值

1. **在語言包中新增：**

`src/i18n/locales/zh-TW.js`:
```javascript
export default {
  myFeature: {
    title: '我的功能',
    description: '這是功能描述'
  }
}
```

`src/i18n/locales/en-US.js`:
```javascript
export default {
  myFeature: {
    title: 'My Feature',
    description: 'This is the feature description'
  }
}
```

2. **在組件中使用：**
```vue
<template>
  <h1>{{ $t('myFeature.title') }}</h1>
  <p>{{ $t('myFeature.description') }}</p>
</template>
```

---

## 🎯 下一步

完成快速體驗後，您可以：

1. **探索所有頁面的翻譯**
   - 瀏覽每個功能頁面
   - 測試各種操作
   - 體驗兩種語言的差異

2. **閱讀完整指南**
   - 了解實作細節
   - 學習如何新增翻譯
   - 參與貢獻翻譯

3. **回饋問題或建議**
   - 發現翻譯錯誤？
   - 有更好的翻譯建議？
   - 想新增其他語言？
   - 歡迎提出 Issue 或 Pull Request！

---

**祝您使用愉快！** 🎉

如有任何問題，請參考 [I18N Guide](./I18N_GUIDE.md) 或聯繫專案維護者。

