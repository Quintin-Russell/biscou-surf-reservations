import BaseService from './BaseService.js'

export default class UserService extends BaseService {
  constructor(baseEndpoint) {
    super({ baseEndpoint })
  }

  async create(params) {
    const res = await this.api.post('/create', params)
    return res.data
  }
}