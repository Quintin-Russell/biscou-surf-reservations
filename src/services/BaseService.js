import Api from './Api.js'

export default class BaseService {
  constructor({ baseEndpoint }) {
    const baseUrl = `${import.meta.env.VITE_API_URI}/${baseEndpoint}`
    this.api = new Api(baseUrl)
  }
}