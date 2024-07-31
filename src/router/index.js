import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/loginView.vue'
import RegisterView from '@/views/auth/registerView.vue'
import DashboardView from '@/views/layouts/DashboardView.vue'
import WorkSpaceView from '@/views/layouts/WorkSpaceView.vue'
import InventoryView from '@/views/layouts/InventoryView.vue'
import FinanceView from '@/views/layouts/FinanceView.vue'
import EmployeeView from '@/views/layouts/EmployeeView.vue'
import ProfileStoreView from '@/views/layouts/ProfileStoreView.vue'
import ProfileUserView from '@/views/layouts/ProfileUserView.vue'
import StoreView from '@/views/layouts/StoreView.vue'
import DetailStoreView from '@/views/layouts/DetailStoreView.vue'
import ForgotPassword from '@/views/auth/forgotPassword.vue'
import NotFoundView from '@/views/layouts/NotFoundView.vue'

import navGuard from '@/service/navGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path : '/user/login',
      name : 'login',
      component : LoginView
    },
    {
      path : '/user/register',
      name : 'register',
      component : RegisterView
    },
    {
      path : '/password/forgot',
      name : 'forgot',
      component : ForgotPassword
    },
    {
      path : '/dashboard',
      name : 'dashboard',
      component : DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path : '/workspace/:id?',
      name : 'workspace',
      component : WorkSpaceView,
      meta: { requiresAuth: true }
    },
    {
      path : '/inventory',
      name : 'inventories',
      component : InventoryView,
      meta: { requiresAuth: true }
    },
    {
      path : '/finance',
      name : 'finance',
      component : FinanceView,
      meta: { requiresAuth: true }
    },
    {
      path : '/employee',
      name : 'employee',
      component : EmployeeView,
      meta: { requiresAuth: true }
    },
    {
      path : '/store',
      name : 'store',
      component : StoreView,
    },
    {
      path : '/store/profile',
      name : 'storeProfile',
      component : ProfileStoreView,
      meta: { requiresAuth: true }
    },
    {
      path : '/store/profile/detail/:code?',
      name : 'storeProfileDetail',
      component : DetailStoreView,
      meta: { requiresAuth: true }
    },
    {
      path : '/user/profile',
      name : 'profile-user',
      component : ProfileUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ]
})

router.beforeEach(navGuard)

export default router
