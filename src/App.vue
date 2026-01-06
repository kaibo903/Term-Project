<template>
  <div class="app-container">
    <!-- 頂部導航欄 -->
    <header class="app-header">
      <div class="header-left">
        <el-button
          text
          class="collapse-btn"
          @click="toggleSidebar"
          :icon="isCollapsed ? Expand : Fold"
        />
        <div class="logo" @click="goToProjects">
          <el-icon class="logo-icon"><TrendCharts /></el-icon>
          <span class="logo-text" v-show="!isCollapsed">Project Test</span>
        </div>
      </div>
      <div class="header-right">
        <div class="language-switcher">
          <el-dropdown @command="handleLanguageChange">
            <span class="language-btn">
              <el-icon><Position /></el-icon>
              <span class="language-text">{{ currentLanguageLabel }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-TW" :class="{ 'is-active': currentLocale === 'zh-TW' }">
                  繁體中文
                </el-dropdown-item>
                <el-dropdown-item command="en-US" :class="{ 'is-active': currentLocale === 'en-US' }">
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="user-info">
          <el-icon class="user-icon"><User /></el-icon>
          <span>{{ $t('nav.admin') }}</span>
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
        </div>
      </div>
    </header>

    <div class="app-body">
      <!-- 手機版遮罩層 -->
      <div
        v-if="isMobile && !isCollapsed"
        class="sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- 左側邊欄 -->
      <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
        <nav class="sidebar-nav">
          <router-link
            to="/projects"
            class="nav-item"
            :class="{ active: activeMenu === '/projects' || activeMenu.startsWith('/projects') }"
            :title="isCollapsed ? $t('nav.projectManagement') : ''"
            @click="handleNavClick"
          >
            <el-icon><House /></el-icon>
            <span class="nav-text">{{ $t('nav.projectManagement') }}</span>
          </router-link>
          <router-link
            to="/optimization"
            class="nav-item"
            :class="{ active: activeMenu === '/optimization' }"
            :title="isCollapsed ? $t('nav.optimization') : ''"
            @click="handleNavClick"
          >
            <el-icon><TrendCharts /></el-icon>
            <span class="nav-text">{{ $t('nav.optimization') }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- 主要內容區域 -->
      <main class="app-main">
        <router-view />
  </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TrendCharts, User, ArrowDown, House, Fold, Expand, Position } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

// 當前語言
const currentLocale = ref(locale.value)

// 當前語言標籤
const currentLanguageLabel = computed(() => {
  return currentLocale.value === 'zh-TW' ? '繁體中文' : 'English'
})

// 語言切換處理
const handleLanguageChange = (lang) => {
  currentLocale.value = lang
  locale.value = lang
  localStorage.setItem('app-locale', lang)
  // 刷新頁面以應用 Element Plus 語言設置
  window.location.reload()
}

// 側邊欄收放狀態
const isCollapsed = ref(false)

// 手機版檢測
const isMobile = ref(false)

const updateIsMobile = () => {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth <= 768
  // 手機版預設收起側邊欄
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 從 localStorage 讀取收放狀態
onMounted(() => {
  updateIsMobile()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null && !isMobile.value) {
      isCollapsed.value = saved === 'true'
    }
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
})

// 切換側邊欄收放
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  if (!isMobile.value) {
    localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
  }
}

// 處理導航點擊（手機版點擊後自動收起）
const handleNavClick = () => {
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 計算當前啟用的選單項
const activeMenu = computed(() => {
  return route.path
})

// 點擊 logo 返回專案管理頁面
const goToProjects = () => {
  router.push('/projects')
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--content-bg);
  overflow: hidden;
}

/* 頂部導航欄 - 無印風格 */
.app-header {
  width: 100%;
  height: 64px;
  background-color: var(--header-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  flex-shrink: 0;
  box-shadow: 0 1px 0 0 var(--border-color);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  padding: 8px !important;
  min-width: 32px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent !important;
  border: 1px solid transparent !important;
  color: var(--text-primary) !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background-color: var(--content-bg) !important;
  border-color: var(--border-color) !important;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 20px;
  color: var(--text-primary);
}

.logo-text {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 語言切換器 */
.language-switcher {
  display: flex;
  align-items: center;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 0;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.language-btn:hover {
  background-color: var(--content-bg);
  border-color: var(--border-color);
}

.language-btn .el-icon {
  font-size: 18px;
}

.language-text {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 0;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background-color: var(--content-bg);
  border-color: var(--border-color);
}

.user-icon {
  font-size: 18px;
}

.arrow-icon {
  font-size: 12px;
}

/* 主體區域 */
.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左側邊欄 - 無印風格 */
.app-sidebar {
  width: 260px;
  background-color: var(--sidebar-bg);
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-nav {
  padding: 32px 0;
  transition: padding 0.3s ease;
}

.app-sidebar.collapsed .sidebar-nav {
  padding: 32px 0;
}

.nav-title {
  padding: 0 32px 20px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  text-transform: none;
  letter-spacing: 0.1em;
  transition: opacity 0.3s ease;
}

.app-sidebar.collapsed .nav-title {
  opacity: 0;
  padding: 0 16px 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  border-right: none;
  position: relative;
  white-space: nowrap;
}

.app-sidebar.collapsed .nav-item {
  padding: 14px 16px;
  justify-content: center;
}

.nav-item:hover {
  background-color: var(--sidebar-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--sidebar-active);
  color: var(--text-primary);
  border-left-color: var(--primary);
  font-weight: 400;
}

.nav-item .el-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.nav-text {
  transition: opacity 0.3s ease;
  overflow: hidden;
}

.app-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

/* 主要內容區域 - 無印風格 */
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--content-bg);
  padding: 40px;
  height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
}

/* 手機版遮罩層 */
.sidebar-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  transition: opacity 0.3s ease;
}

/* 手機版響應式 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }

  .logo-text {
    display: none;
  }

  .app-sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .app-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .app-sidebar.collapsed {
    width: 260px;
    transform: translateX(-100%);
  }

  .app-main {
    padding: 16px;
    margin-left: 0;
  }

  .user-info span {
    display: none;
  }

  .language-text {
    display: none;
  }
}
</style>

<style>
/* 無印風格全局樣式覆蓋 Element Plus */
.el-card {
  border: 1px solid var(--border-color) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background-color: var(--card-bg) !important;
}

.el-card__header {
  border-bottom: 1px solid var(--border-color) !important;
  padding: 24px 32px !important;
  background-color: var(--card-bg) !important;
}

.el-card__body {
  padding: 32px !important;
}

.el-button {
  border-radius: 0 !important;
  font-weight: 400 !important;
  border: 1px solid var(--border-color) !important;
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

.el-button--primary {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: var(--text-white) !important;
}

.el-button--primary:hover {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  color: var(--text-white) !important;
}

.el-button--success {
  background-color: var(--success) !important;
  border-color: var(--success) !important;
}

.el-button--warning {
  background-color: var(--warning) !important;
  border-color: var(--warning) !important;
}

.el-button--danger {
  background-color: var(--danger) !important;
  border-color: var(--danger) !important;
}

.el-input__wrapper {
  border-radius: 0 !important;
  border-color: var(--border-color) !important;
  box-shadow: none !important;
}

.el-input__wrapper:hover {
  border-color: var(--primary) !important;
}

.el-input.is-focus .el-input__wrapper {
  border-color: var(--primary) !important;
  box-shadow: none !important;
}

.el-table {
  border: 1px solid var(--border-color) !important;
  border-radius: 0 !important;
  overflow: hidden !important;
}

.el-table th {
  background-color: var(--content-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
  font-weight: 400 !important;
}

.el-table td {
  border-bottom: 1px solid var(--border-light) !important;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: var(--content-bg) !important;
}

.el-table__row:hover {
  background-color: var(--sidebar-hover) !important;
}

.el-dialog {
  border-radius: 0 !important;
  border: 1px solid var(--border-color) !important;
  box-shadow: none !important;
}

.el-dialog__header {
  border-bottom: 1px solid var(--border-color) !important;
  padding: 32px !important;
}

.el-dialog__body {
  padding: 32px !important;
}

.el-form-item__label {
  color: var(--text-primary) !important;
  font-weight: 400 !important;
}

.el-tag {
  border-radius: 0 !important;
  font-weight: 400 !important;
  border: 1px solid var(--border-color) !important;
}

.el-select .el-input__wrapper {
  border-radius: 0 !important;
}

.el-radio {
  margin-right: 24px !important;
}

.el-radio__label {
  color: var(--text-primary) !important;
  font-weight: 400 !important;
}

.el-descriptions {
  border-radius: 0 !important;
}

.el-descriptions__label {
  font-weight: 600 !important;
  color: var(--text-secondary) !important;
}

.el-descriptions__content {
  color: var(--text-primary) !important;
  font-weight: 400 !important;
}

.el-breadcrumb {
  font-size: 14px !important;
}

.el-breadcrumb__inner {
  color: var(--text-secondary) !important;
  font-weight: 400 !important;
}

.el-breadcrumb__inner.is-link {
  color: var(--primary) !important;
}

.el-breadcrumb__inner.is-link:hover {
  color: var(--primary-hover) !important;
}
</style>
