<!-- src/layouts/TheHeader.vue -->
<template>
  <header class="app-header">
    <div class="app-header__left">
      <div class="app-header__logo">
        <span class="icon icon-launchers icon-24"></span>
        <span class="icon-user icon-32"></span>
        <span style="font-weight:700;font-size:18px">CRM</span>
      </div>

      <nav class="app-header__nav">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="app-header__nav-item"
          :class="{ 'is-active': isActive(item.to) }">
          <span :class="['icon', item.icon, 'icon-16']"></span>
          <span class="app-header__nav-text">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="app-header__right">
      <span class="icon-avt icon-32"></span>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Bàn làm việc', to: '/dashboard', icon: 'icon-home' },
  { label: 'Khách hàng', to: '/customers', icon: 'icon icon-customer' },
  { label: 'Cơ hội', to: '/opportunities', icon: 'icon-tag' },
  { label: 'Báo giá', to: '/quotes', icon: 'icon-book' },
  { label: 'Đơn hàng', to: '/orders', icon: 'icon-cart' },
  { label: 'Hàng hóa', to: '/products', icon: 'icon-goods' },
  { label: 'Báo cáo', to: '/reports', icon: 'icon-chart' },
  { label: 'Tất cả', to: '/all', icon: 'icon-list' },
]

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
