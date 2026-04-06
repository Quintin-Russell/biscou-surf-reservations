import { defineStore } from 'pinia'
import { authService } from "@/services/index.js"

export const useMeStore = defineStore('me', {
  state: () => ({
    me: null
  }),
  getters: {},
  actions: {
    async initialize(router) {
      try {
        const res = await authService.verifyMe()
        await this.setMe(res?.data || res, router)
      } catch (err) {
        console.error('Could not set user: ', err)
      }
    },
    async login(params, router) {
      const res = await authService.login(params)
      await this.setMe(res, router)
    },
    async logout(router) {
      await authService.logout()
      this.me = null
      await router.push('/')
    },
    async setMe(me,router) {
      this.me = me
      if (this.me?.id) await router.push('/home')
    }
  }
})