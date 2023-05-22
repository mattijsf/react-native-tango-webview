import * as React from "react"
import { useCallback, useRef } from "react"

import { SafeAreaView, StyleSheet } from "react-native"
import ComlinkWebview, { type RemoteObject } from "react-native-comlink-webview"

const HTML = `<!DOCTYPE html>\n
<html>
  <body>
    <script>
      const objApi = {
        showAlert(message) {
          document.write("<h1>" + message + "</h1>")
        },
      };

      Comlink.expose(objApi);
    </script>
  </body>
</html>`

type ClientAPI = {
  add(a: number, b: number): number
  showAlert(message: string): void
}

export default function App(): JSX.Element {
  const remoteObjectRef = useRef<RemoteObject<ClientAPI>>()

  const onRemoteObjectReady = useCallback((remoteObject: RemoteObject<ClientAPI>) => {
    remoteObject.showAlert("Hi from native " + new Date().toLocaleString())
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ComlinkWebview
        style={styles.webview}
        onRemoteObjectReady={onRemoteObjectReady}
        remoteObjectRef={remoteObjectRef}
        source={{ html: HTML }}
      />
    </SafeAreaView>
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
