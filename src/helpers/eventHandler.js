import { accommodationEventHandler, reservationEventHandler, userEventHandler } from './eventHandlers/index.js'

export const eventHandler = {
  delegateEvent(event) {
    const eventType = event.event_type
    const eventClass = eventType.split('.')[0]

    switch (eventClass) {
      case 'user':
        userEventHandler.handle(event)
        break
      case 'reservation':
        reservationEventHandler.handle(event)
        break
      case 'accommodation':
        accommodationEventHandler.handle(event)
        break
      default:
        throw new Error(`Unknown event type for ${eventType}`)
    }
  }
}
