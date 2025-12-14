import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import {createRouter, createWebHistory} from "vue-router"

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({ routes, history: createWebHistory() })

export default router