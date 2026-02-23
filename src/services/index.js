import AuthService from './AuthService'
import WebSocketService from './WebSocketService'

const authService = new AuthService('auth')
const webSocketService = new WebSocketService()

export {
  authService,
  webSocketService
}