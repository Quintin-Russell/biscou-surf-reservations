import { defineStore } from 'pinia'
import { userService } from "@/services/index.js"
import { ROLES } from "@/helpers/constants/user-constants.js"

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false
  }),
  getters: {
    employees: (state) => state.users.filter(user => user.role === ROLES.EMPLOYEE),
    guests: (state) => state.users.filter(user => user.role !== ROLES.EMPLOYEE)
  },
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const users = await userService.list()
        if (!Array.isArray(users)) throw new Error('Unexpected users response: expected an array')
        this.users = users
      } finally {
        this.loading = false
      }
    },
    async updateUser(id, params) {
      const updated = await userService.update(id, params)
      this.replaceUser(updated)
      return updated
    },
    replaceUser(updated) {
      const index = this.users.findIndex(user => user.id === updated.id)
      if (index !== -1) this.users.splice(index, 1, updated)
    }
  }
})
