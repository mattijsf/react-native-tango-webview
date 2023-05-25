import * as ComlinkLib from "comlink"

const ON_COMLINK_EXPOSE = "onComlinkExpose"

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

function webviewEndpoint(): ComlinkLib.Endpoint {
  const listeners = new WeakMap()
  return {
    postMessage: (dataMesage): void => {
      const stringMessage = JSON.stringify(dataMesage)
      window.ReactNativeWebView.postMessage(stringMessage)
    },
    addEventListener: (_type, handler): void => {
      const listener = (event: WebviewMessageEvent): void => {
        const raw = event.data
        const data = JSON.parse(raw)
        if ("handleEvent" in handler) {
          handler.handleEvent({ data } as any)
        } else {
          handler({ data } as any)
        }
      }

      document.addEventListener("message", listener)
      window.addEventListener("message", listener)

      listeners.set(handler, listener)
    },

    removeEventListener: (_type, handler): void => {
      const listener = listeners.get(handler)
      if (!listener) return
      document.removeEventListener("message", listener)
      window.removeEventListener("message", listener)
      listeners.delete(handler)
    },
    start: (): void => {
      "start" in window.ReactNativeWebView &&
        typeof window.ReactNativeWebView.start === "function" &&
        window.ReactNativeWebView.start &&
        window.ReactNativeWebView.start.bind(window.ReactNativeWebView)
    },
  }
}

export const expose: typeof ComlinkLib.expose = (...args) => {
  if (args.length === 1 && "ReactNativeWebView" in window) {
    ComlinkLib.expose(args[0], webviewEndpoint())
  }
  ComlinkLib.expose(...args)
  window.ReactNativeWebView.postMessage(ON_COMLINK_EXPOSE)
}

export const {
  createEndpoint,
  finalizer,
  proxy,
  proxyMarker,
  releaseProxy,
  transfer,
  transferHandlers,
  windowEndpoint,
  wrap,
} = ComlinkLib
