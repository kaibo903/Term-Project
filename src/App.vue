<template>
  <div class="app-container">
    <!-- 頂部導航欄 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo" @click="goToProjects">
          <el-icon class="logo-icon"><TrendCharts /></el-icon>
          <span class="logo-text">Project Test</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-icon class="user-icon"><User /></el-icon>
          <span>管理員</span>
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
        </div>
      </div>
    </header>

    <div class="app-body">
      <!-- 左側邊欄 -->
      <aside class="app-sidebar">
        <nav class="sidebar-nav">
          <router-link
            to="/projects"
            class="nav-item"
            :class="{ active: activeMenu === '/projects' || activeMenu.startsWith('/projects') }"
          >
            <el-icon><House /></el-icon>
            <span>專案管理</span>
          </router-link>
          <router-link
            to="/optimization"
            class="nav-item"
            :class="{ active: activeMenu === '/optimization' }"
          >
            <el-icon><TrendCharts /></el-icon>
            <span>進度成本最佳化</span>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TrendCharts, User, ArrowDown, House } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

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
}

.sidebar-nav {
  padding: 32px 0;
}

.nav-title {
  padding: 0 32px 20px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  text-transform: none;
  letter-spacing: 0.1em;
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
}

/* 主要內容區域 - 無印風格 */
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--content-bg);
  padding: 40px;
  height: calc(100vh - 64px);
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
