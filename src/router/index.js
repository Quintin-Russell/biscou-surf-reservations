import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import {createRouter, createWebHistory} from "vue-router"
import { useMeStore } from "@/stores/index.js"

const DEFAULT_TITLE = 'Biscou Reservation Manager'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { title: 'Login' },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: 'Welcome' },
  },
  {
    path: '/management',
    component: () => import('@/views/Management.vue'),
    redirect: { name: 'ManagementUsers' },
    meta: { requiresAuth: true },
    children: [
      {
        path: 'users',
        name: 'ManagementUsers',
        component: () => import('@/components/management/users/UserManagement.vue'),
        meta: { title: 'User Management', requiresManagement: true },
      },
      {
        path: 'profile',
        name: 'ManagementProfile',
        component: () => import('@/components/management/profile/ProfilePage.vue'),
        meta: { title: 'My Profile' },
      }
    ]
  }
]

const router = createRouter({ routes, history: createWebHistory() })

router.beforeEach(async (to) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) return true
  const meStore = useMeStore()
  const me = await meStore.loadMe()
  if (!me?.id) return { name: 'Login' }
  if (to.matched.some(record => record.meta.requiresManagement) && !meStore.isManagement) return { name: 'ManagementProfile' }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta?.title ? to.meta.title + ' |' : ''} ${DEFAULT_TITLE}`
})

export default router