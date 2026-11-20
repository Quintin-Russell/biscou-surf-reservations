import BaseService from './BaseService.js'
import { useMeStore, useUsersStore } from "@/stores/index.js"

export default class ProfileService extends BaseService {
  constructor(baseEndpoint) {
    super({ baseEndpoint })
  }

  async update(id, params) {
    const res = await this.api.patch(`/${id}`, params)
    const updated = res.data
    if (!updated?.id) throw new Error('Unexpected profile response: expected a user')
    useMeStore().me = updated
    useUsersStore().replaceUser(updated)
    return updated
  }

  async changePassword(id, { current_password, new_password, confirm_password }) {
    const res = await this.api.patch(`/${id}/change_password`, { current_password, new_password, confirm_password })
    return res.data
  }
}
