// i18n 配置檔案
import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'

// 從本地儲存取得語言設定，預設為繁體中文
const savedLocale = localStorage.getItem('app-locale') || 'zh-TW'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale, // 當前語言
  fallbackLocale: 'zh-TW', // 回退語言
  messages: {
    'zh-TW': zhTW,
    'en-US': enUS
  },
  globalInjection: true // 全局注入 $t 函數
})

export default i18n

