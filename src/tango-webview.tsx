import React, { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from "react"
import { WebView, type WebViewMessageEvent, type WebViewProps } from "react-native-webview"
import * as TangoRPC from "tango-rpc"
import _TANGO_RPC_WEBVIEW_SCRIPT from "./tango-rpc-webview-script.json"

export const TANGO_RPC_WEBVIEW_SCRIPT: string = _TANGO_RPC_WEBVIEW_SCRIPT

type MessageListener = (message: string) => void

export type TangoWebviewProps<T> = {
  onConnect?: (proxy: T) => void
  clientProxyRef?: MutableRefObject<T | undefined>
} & WebViewProps

const TangoWebview = <T,>({
  onConnect: onConnect,
  clientProxyRef: clientProxyRef,
  ...webViewProps
}: TangoWebviewProps<T>): JSX.Element => {
  const webViewRef = useRef<WebView>(null)
  const messageEventListeners = useMemo(() => new Set<MessageListener>(), [])
  const rpcChannel = useMemo<TangoRPC.Channel>(
    () => ({
      sendMessage: message => webViewRef.current?.postMessage(message),
      addMessageListener: messageEventListeners.add.bind(messageEventListeners),
      removeMessageListener: messageEventListeners.delete.bind(messageEventListeners),
    }),
    [messageEventListeners]
  )

  const rpcClient = useMemo(() => new TangoRPC.Client<T>(rpcChannel), [rpcChannel])

  const onConnectRef = useRef(onConnect)
  onConnectRef.current = onConnect

  useEffect(() => {
    rpcClient.onConnect(() => {
      if (clientProxyRef) {
        clientProxyRef.current = rpcClient.proxy
      }
      onConnectRef.current?.(rpcClient.proxy)
    })

    return () => {
      rpcClient.cleanup()
    }
  }, [clientProxyRef, rpcClient])

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = event.nativeEvent.data ?? ""
      messageEventListeners.forEach(listener => listener(data))
      webViewProps.onMessage?.(event)
    },
    [messageEventListeners, webViewProps]
  )

  return <WebView {...webViewProps} ref={webViewRef} javaScriptEnabled onMessage={onMessage} />
}

export default TangoWebview
