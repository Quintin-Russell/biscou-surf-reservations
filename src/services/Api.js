import axios from 'axios'

export default class Api {
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  async get(endpoint, params) {
    return this.instance.get(endpoint, params)
  }
  async post(endpoint, params) {
    return this.instance.post(endpoint, params)
  }
  async patch(endpoint, params) {
    return this.instance.patch(endpoint, params)
  }
  async delete(endpoint, params) {
    return this.instance.delete(endpoint, params)
  }
}