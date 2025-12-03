import axios from 'axios'

export default class Api {
  constructor(baseEndpoint) {
    this.api = axios.create({
      baseURL: `${import.meta.env.API_URI}/${baseEndpoint}`,
      withCredentials: true
    })
  }

  async get(endpoint, params) {
    return this.api.get(endpoint, params)
  }
  async post(endpoint, params) {
    return this.api.post(endpoint, params)
  }
  async patch(endpoint, params) {
    return this.api.patch(endpoint, params)
  }
  async delete(endpoint, params) {
    return this.api.delete(endpoint, params)
  }
}