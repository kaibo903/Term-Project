<template>
  <div class="app-container">
    <!-- 頂部導航欄 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon"><TrendCharts /></el-icon>
          <span class="logo-text">營造廠決策分析平台</span>
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
          <div class="nav-title">工程管理系統</div>
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
            <span>投標優化</span>
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
import { useRoute } from 'vue-router'
import { TrendCharts, User, ArrowDown, House } from '@element-plus/icons-vue'

const route = useRoute()

// 計算當前啟用的選單項
const activeMenu = computed(() => {
  return route.path
})
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

/* 頂部導航欄 - 簡約深色 */
.app-header {
  width: 100%;
  height: 60px;
  background-color: var(--header-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  box-shadow: var(--shadow);
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
}

.logo-icon {
  font-size: 24px;
  color: var(--text-white);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-white);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-white);
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
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

/* 左側邊欄 - 簡約深色 */
.app-sidebar {
  width: 240px;
  background-color: var(--sidebar-bg);
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-title {
  padding: 0 20px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: var(--sidebar-hover);
  color: var(--text-white);
}

.nav-item.active {
  background-color: var(--sidebar-active);
  color: var(--text-white);
  border-left-color: var(--text-white);
  font-weight: 500;
}

.nav-item .el-icon {
  font-size: 18px;
}

/* 主要內容區域 - 白色背景 */
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--content-bg);
  padding: 24px;
}
</style>

<style>
/* 簡約風格全局樣式覆蓋 Element Plus */
.el-card {
  border: 1px solid var(--border-light) !important;
  border-radius: 8px !important;
  box-shadow: var(--shadow) !important;
  background-color: var(--card-bg) !important;
}

.el-card__header {
  border-bottom: 1px solid var(--border-light) !important;
  padding: 16px 20px !important;
  background-color: var(--card-bg) !important;
}

.el-card__body {
  padding: 20px !important;
}

.el-button {
  border-radius: 6px !important;
  font-weight: 500 !important;
}

.el-button--primary {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
}

.el-button--primary:hover {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
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
  border-radius: 6px !important;
  border-color: var(--border-color) !important;
}

.el-input__wrapper:hover {
  border-color: var(--primary) !important;
}

.el-input.is-focus .el-input__wrapper {
  border-color: var(--primary) !important;
}

.el-table {
  border: 1px solid var(--border-light) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

.el-table th {
  background-color: #F8F9FA !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
  font-weight: 600 !important;
}

.el-table td {
  border-bottom: 1px solid var(--border-light) !important;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #FAFBFC !important;
}

.el-table__row:hover {
  background-color: #F5F7FA !important;
}

.el-dialog {
  border-radius: 8px !important;
  border: 1px solid var(--border-light) !important;
  box-shadow: var(--shadow-md) !important;
}

.el-dialog__header {
  border-bottom: 1px solid var(--border-light) !important;
  padding: 20px !important;
}

.el-dialog__body {
  padding: 20px !important;
}

.el-form-item__label {
  color: var(--text-primary) !important;
  font-weight: 500 !important;
}

.el-tag {
  border-radius: 4px !important;
  font-weight: 500 !important;
}

.el-select .el-input__wrapper {
  border-radius: 6px !important;
}

.el-radio {
  margin-right: 24px !important;
}

.el-radio__label {
  color: var(--text-primary) !important;
  font-weight: 400 !important;
}

.el-descriptions {
  border-radius: 8px !important;
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
