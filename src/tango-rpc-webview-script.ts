type WebviewMessageEvent = { data: string }

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void
    }
  }
  interface Document {
    addEventListener(type: string, handler: any): any
  }
}

import { type Channel } from "tango-rpc"

export function createWebViewChannel(): Channel {
  const listeners = new WeakMap()

  return {
    sendMessage(message): void {
      window.ReactNativeWebView.postMessage(message)
    },
    addMessageListener(handler): void {
      const listener = (event: WebviewMessageEvent): void => {
        const raw = event.data
        handler(raw)
      }
      document.addEventListener("message", listener)
      window.addEventListener("message", listener)

      listeners.set(handler, listener)
    },
    removeMessageListener(handler): void {
      const listener = listeners.get(handler)
      if (!listener) return
      document.removeEventListener("message", listener)
      window.removeEventListener("message", listener)
    },
  }
}

export * from "tango-rpc"
