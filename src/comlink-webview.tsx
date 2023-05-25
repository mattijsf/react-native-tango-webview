import * as Comlink from "comlink"
import React, { useCallback, type MutableRefObject } from "react"
import { WebView, type WebViewMessageEvent, type WebViewProps } from "react-native-webview"
import { stringEndpoint } from "./comlink-string-endpoint"
import _COMLINK_WEBVIEW_SCRIPT from "./comlink-webview-script.json"

const ON_COMLINK_EXPOSE = "onComlinkExpose"

export const COMLINK_WEBVIEW_SCRIPT: string = _COMLINK_WEBVIEW_SCRIPT

type MessageListener = (message: string) => void
export type RemoteObject<T> = Comlink.Remote<T>

export type ComlinkWebviewProps<T> = {
  onRemoteObjectReady?: (remoteObject: RemoteObject<T>) => void
  remoteObjectRef?: MutableRefObject<RemoteObject<T> | undefined>
} & WebViewProps

const ComlinkWebview = <T,>({
  onRemoteObjectReady,
  remoteObjectRef,
  ...webViewProps
}: ComlinkWebviewProps<T>): JSX.Element => {
  const webViewRef = React.useRef<WebView>(null)
  const messageEventListeners = React.useRef(new Set<MessageListener>()).current

  const onComlinkExpose = useCallback(() => {
    const endpoint = stringEndpoint({
      postMessage: msg => {
        webViewRef.current?.postMessage(msg)
      },
      addEventListener: el => messageEventListeners.add(el),
      removeEventListener: el => messageEventListeners.delete(el),
    })

    const wrappedObj = Comlink.wrap<T>(endpoint, {})
    if (remoteObjectRef) {
      remoteObjectRef.current = wrappedObj
    }
    onRemoteObjectReady?.(wrappedObj)
  }, [messageEventListeners, onRemoteObjectReady, remoteObjectRef])

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = event.nativeEvent.data ?? ""
      if (data === ON_COMLINK_EXPOSE) {
        onComlinkExpose?.()
        return
      }
      messageEventListeners.forEach(listener => listener(data))
      webViewProps.onMessage?.(event)
    },
    [messageEventListeners, onComlinkExpose, webViewProps]
  )

  return <WebView {...webViewProps} ref={webViewRef} javaScriptEnabled onMessage={onMessage} />
}

export default ComlinkWebview
