import BaseService from './BaseService.js'

export default class UserService extends BaseService {
  constructor(baseEndpoint) {
    super({ baseEndpoint })
  }

  async signup(params) {
    const res = await this.api.post('/signup', params)
    return res.data
  }

  async create(params) {
    const res = await this.api.post('', params)
    return res.data
  }

  async list() {
    const res = await this.api.get('')
    return res.data
  }

  async update(id, { role, permission }) {
    const res = await this.api.patch(`/${id}`, { role, permission })
    return res.data
  }
}
