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
    meta: { requiresManagement: true },
    children: [
      {
        path: 'users',
        name: 'ManagementUsers',
        component: () => import('@/components/management/users/UserManagement.vue'),
        meta: { title: 'User Management' },
      }
    ]
  }
]

const router = createRouter({ routes, history: createWebHistory() })

router.beforeEach(async (to) => {
  if (!to.matched.some(record => record.meta.requiresManagement)) return true
  const meStore = useMeStore()
  const me = await meStore.loadMe()
  if (!me?.id) return { name: 'Login' }
  if (!meStore.isManagement) return { name: 'Home' }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta?.title ? to.meta.title + ' |' : ''} ${DEFAULT_TITLE}`
})

export default router