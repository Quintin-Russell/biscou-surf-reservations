import { BaseService } from './index.js'

class AuthService extends BaseService {
  constructor({ baseEndpoint }) {
    super({ baseEndpoint })
  }

  async login({ email, password }) {
    return await this.api.get('/login', { email, password })
  }
}

export default new AuthService('/auth')