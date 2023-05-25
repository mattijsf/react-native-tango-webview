/* eslint-disable react-native/no-inline-styles */
import * as React from "react"
import { useCallback, useState } from "react"
import { Button } from "react-native"

import ComlinkWebview, {
  COMLINK_WEBVIEW_SCRIPT,
  type RemoteObject,
} from "react-native-comlink-webview"

type ClientAPI = {
  sayHi(message: string): boolean
}

const HTML = `
<html>
  <body style="background-color:lightgrey;">
    <script>
      ${COMLINK_WEBVIEW_SCRIPT} <!-- OR: <script src="https://unpkg.com/react-native-comlink-webview/dist/umd/comlink.mjs"></script> -->

      const myApi = {
        sayHi(message) {
          alert(message)
          return true
        },
      };

      Comlink.expose(myApi);
    </script>
  </body>
</html>`

export default function App(): JSX.Element {
  const [clientApi, setClientApi] = useState<RemoteObject<ClientAPI>>()

  const showMessage = useCallback(async () => {
    if (!clientApi) return
    const result = await clientApi.sayHi("Hello World!")
    console.log(result) // true
  }, [clientApi])

  return (
    <>
      <ComlinkWebview
        style={{ flex: 1 }}
        onRemoteObjectReady={setClientApi}
        source={{ html: HTML }}
      />
      <Button disabled={!clientApi} onPress={showMessage} title="Show Message" />
    </>
  )
}
