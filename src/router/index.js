import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import {createRouter, createWebHistory} from "vue-router"

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
  }
]

const router = createRouter({ routes, history: createWebHistory() })

router.afterEach(({ to }) => {
  document.title = `${to.meta?.title ? to.meta.title + ' |' : ''} ${DEFAULT_TITLE}`
})

export default router