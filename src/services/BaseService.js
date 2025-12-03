import { Api } from './index.js'

export default class BaseService {
  constructor({ baseEndpoint }) {
    this.api = new Api(baseEndpoint)
  }
}