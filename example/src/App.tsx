/* eslint-disable react-native/no-inline-styles */
import * as React from "react"
import { useCallback, useMemo, useState } from "react"
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
      ${COMLINK_WEBVIEW_SCRIPT}
      const api = {
        sayHi(message) {
          alert(message)
          return true
        },
      };
      Comlink.expose(api);
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

  const source = useMemo(() => ({ html: HTML }), [])

  return (
    <>
      <ComlinkWebview<ClientAPI>
        style={{ flex: 1 }}
        onRemoteObjectReady={setClientApi}
        source={source}
      />
      <Button disabled={!clientApi} onPress={showMessage} title="Show Message" />
    </>
  )
}
