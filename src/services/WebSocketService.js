import { eventHandler } from '../helpers/eventHandler.js'

export default class WebSocketService {
  constructor() {
    this.socket = null
    this.reconnectAttempts = null
    this.maxReconnectAttempts = 10
  }
  init() {
    this.socket = new WebSocket(import.meta.env.VITE_WS_URL)
    this.reconnectAttempts = 0

    this.socket.onopen = () => {
      console.log('WebSocket Connected')
      this.subscribe()
    }
    // handlers
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'ping') return

      if (data.message) {
        eventHandler.delegateEvent(data.message)
      }
    }

    this.socket.onclose = () => {
      console.log('🔌 Disconnected from ActionCable')

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached')
        return
      }

      this.reconnectAttempts++
      
      setTimeout(() => {
        this.init()
      }, 1000)
    }

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
    }
  }

  disconnect() {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.onmessage = null
      this.socket.onclose = null
      this.socket.onerror = null

      this.socket.close(1000, 'Normal closure')
      this.socket = null
    }
  }

  subscribe() {
    // make subscribe message
    const subscriptionMessage = JSON.stringify({
      type: 'subscribe',
      identifier: JSON.stringify({channel: 'events'})
    })
    // send subscribe message via websocket
    this.socket.send(subscriptionMessage)
  }
}