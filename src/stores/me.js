import { defineStore } from 'pinia'
import { authService } from "@/services/index.js"

export const useMeStore = defineStore('me', {
  state: () => ({
    me: null,
    loadMePromise: null
  }),
  getters: {
    isManagement: (state) => !!state.me?.is_management
  },
  actions: {
    async initialize(router) {
      await this.loadMe()
      await this.setMe(this.me, router)
    },
    async loadMe() {
      if (this.me) return this.me
      if (!this.loadMePromise) {
        this.loadMePromise = authService.verifyMe()
          .then(res => { this.me = res?.data || res })
          .catch(err => { console.error('Could not set user: ', err) })
          .finally(() => { this.loadMePromise = null })
      }
      await this.loadMePromise
      return this.me
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
      if (!this.me?.id) return
      await router.isReady()
      if (router.currentRoute.value.name === 'Login') await router.push('/home')
    }
  }
})
