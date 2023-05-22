import { INJECTED_COMLINK_LIB } from "./injected-comlink-lib"

export const ON_COMLINK_EXPOSE = "onComlinkExpose"

const INJECTED_WEBVIEW_ENDPOINT_FUNCTION = `
function webviewEndpoint() {
    const postMessageTarget = window.ReactNativeWebView
    const eventSource = window
  
    const listeners = new WeakMap()
    return {
      postMessage: msg => {
        postMessageTarget.postMessage(JSON.stringify(msg), "*")
      },
      addEventListener: (_type, handler) => {
        const listener = (event) => {
          const raw = event.data 
          const data = JSON.parse(raw)
          if ('handleEvent' in handler) {
            handler.handleEvent({ data })
          } else {
            handler({ data })
          }
        }
  
        document.addEventListener('message', listener, false); // android
        window.addEventListener('message', listener, false); // ios
  
        listeners.set(handler, listener)
      },
  
      removeEventListener: (_type, handler) => {
        const listener = listeners.get(handler)
        if (!listener) return
        document.removeEventListener("message", listener)
        window.removeEventListener("message", listener)
        listeners.delete(handler)
      },
      start: () => {
        postMessageTarget.start && postMessageTarget.start.bind(postMessageTarget)
      }
    }
  }
`

export const INJECTED_WEBVIEW_COMLINK = `
    ${INJECTED_WEBVIEW_ENDPOINT_FUNCTION}
    
    // patching comlink to replace the default endpoint
    ${INJECTED_COMLINK_LIB.replace("= globalThis", "= webviewEndpoint()")}

    const originalComlinkExpose = Comlink.expose
    Comlink.expose = (...args) => {
      originalComlinkExpose(...args);
      window.ReactNativeWebView.postMessage("${ON_COMLINK_EXPOSE}")
    }

    window.Comlink = Comlink;
`
