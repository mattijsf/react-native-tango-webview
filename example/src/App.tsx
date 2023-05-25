import * as React from "react"
import { useCallback, useRef } from "react"

import { Alert, Button, StyleSheet } from "react-native"
import ComlinkWebview, {
  COMLINK_WEBVIEW_SCRIPT,
  type RemoteObject,
} from "react-native-comlink-webview"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

const HTML = `<!DOCTYPE html>\n
<html>
  <head>
  </head>
  <body>
    <h1 id="message">TEST</h1>
    <script>
      ${COMLINK_WEBVIEW_SCRIPT}
      const api = {
        showMessage(message) {
          document.getElementById("message").innerHTML = message
        },
        getMessage() {
          return "Hi from webview " + new Date().toLocaleString();
        }
      };
      Comlink.expose(api);
    </script>
  </body>
</html>`

type ClientAPI = {
  showMessage(message: string): void
  getMessage(): string
}

export default function App(): JSX.Element {
  const remoteObjectRef = useRef<RemoteObject<ClientAPI>>()

  const onRemoteObjectReady = useCallback((remoteObject: RemoteObject<ClientAPI>) => {
    remoteObject.showMessage("Hi from onRemoteObjectReady " + new Date().toLocaleString())
  }, [])

  const showMessage = useCallback(() => {
    if (!remoteObjectRef.current) return
    remoteObjectRef.current.showMessage("Hi from native button " + new Date().toLocaleString())
  }, [])

  const getMessage = useCallback(async () => {
    if (!remoteObjectRef.current) return
    const message = await remoteObjectRef.current.getMessage()
    Alert.alert(message)
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ComlinkWebview
          style={styles.webview}
          onRemoteObjectReady={onRemoteObjectReady}
          remoteObjectRef={remoteObjectRef}
          source={{ html: HTML }}
        />
        <Button onPress={showMessage} title="Show Message" />
        <Button onPress={getMessage} title="Get Message" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
})
