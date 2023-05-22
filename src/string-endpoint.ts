import { type Endpoint } from "./comlink/protocol"

interface StringEndpoint {
  postMessage(message: string): void
  addEventListener: (listener: (message: string) => void) => void
  removeEventListener: (listener: (message: string) => void) => void
  start?: () => void
}

export function stringEndpoint(sep: StringEndpoint): Endpoint {
  const listeners = new WeakMap()
  return {
    postMessage: msg => sep.postMessage(JSON.stringify(msg)),
    addEventListener: (_, handler): void => {
      const listener = (raw: any): void => {
        const data = JSON.parse(raw)
        if ("handleEvent" in handler) {
          handler.handleEvent({ data } as unknown as Event)
        } else {
          handler({ data } as unknown as Event)
        }
      }
      sep.addEventListener(listener)
      listeners.set(handler, listener)
    },
    removeEventListener: (_, handler): void => {
      const listener = listeners.get(handler)
      if (!listener) return
      sep.removeEventListener(listener)
      listeners.delete(handler)
    },
    start: sep.start && sep.start.bind(sep),
  }
}
