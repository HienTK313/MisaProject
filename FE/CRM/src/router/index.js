// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/customers',
      component: () => import('@/views/customers/CustomersView.vue'),
    },
    {
      path: '/customers/new',
      component: () => import('@/views/customers/CustomersFormView.vue'),
    },
    {
      path: '/customers/:id/edit',
      component: () => import('@/views/customers/CustomersFormView.vue'),
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/customers' },
  ],
})

export default router
