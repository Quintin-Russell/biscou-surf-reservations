import AuthService from './AuthService'
import WebSocketService from './WebSocketService'
import UserService from './UserService'
import ProfileService from './ProfileService'

const authService = new AuthService('auth')
const webSocketService = new WebSocketService()
const userService = new UserService('users')
const profileService = new ProfileService('profiles')

export {
  authService,
  profileService,
  userService,
  webSocketService
}