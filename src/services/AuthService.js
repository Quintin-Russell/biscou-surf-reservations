import BaseService from './BaseService.js'

export default class AuthService extends BaseService {
  constructor(baseEndpoint) {
    super({ baseEndpoint })
  }

  async login({ email, password }) {
    return await this.api.post('/login', { email, password })
  }

  async logout() {
    return await this.api.post('/logout')
  }

  async verifyMe() {
    return await this.api.get('/current_user')
  }
}