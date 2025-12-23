import { defineStore } from 'pinia'
import {authService} from "../services/index.js"

export const useMeStore = defineStore('me', {
  state: () => ({
    me: null
  }),
  getters: {
    me: state => state?.me,
  },
  actions: {
    async login(params, router) {
      const loginRes = await authService.login(params)
      this.me = loginRes.data.me
      await router.push('/home')
    },
    async logout(router) {
      await authService.logout()
      this.me = null
      await router.push('/')
    }
  }
})