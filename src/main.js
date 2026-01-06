import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import enUs from 'element-plus/dist/locale/en.mjs'
import router from './router'
import App from './App.vue'
import './style.css'
import i18n from './i18n'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'

// 註冊必要的 ECharts 組件
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent
])

// 建立 Vue 應用程式
const app = createApp(App)

// 根據當前語言設定 Element Plus locale
const getElementLocale = () => {
  const currentLocale = localStorage.getItem('app-locale') || 'zh-TW'
  return currentLocale === 'en-US' ? enUs : zhTw
}

// 註冊 Element Plus
app.use(ElementPlus, {
  locale: getElementLocale()
})

// 註冊所有 Element Plus 圖示
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 註冊 vue-echarts
app.component('v-chart', ECharts)

// 註冊 i18n
app.use(i18n)

// 註冊路由
app.use(router)

// 掛載應用程式
app.mount('#app')
