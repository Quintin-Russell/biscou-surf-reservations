import AuthService from './AuthService'
import WebSocketService from './WebSocketService'
import UserService from './UserService'

const authService = new AuthService('auth')
const webSocketService = new WebSocketService()
const userService = new UserService('users')

export {
  authService,
  userService,
  webSocketService
}