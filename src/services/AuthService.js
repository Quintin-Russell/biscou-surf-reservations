import BaseService from './BaseService.js'

export default class AuthService extends BaseService {
  constructor(baseEndpoint) {
    super({ baseEndpoint })
  }

  async emailExists(email) {
    const res = await this.api.get('/email_exists', { email })
    return res.data
  }

  async login({ email, password }) {
    const res = await this.api.post('/login', { email, password })
    return res.data
  }

  async logout() {
    const res = await this.api.post('/logout')
    return res.data
  }

  async verifyMe() {
    const res = await this.api.get('/current_user')
    return res.data
  }
}