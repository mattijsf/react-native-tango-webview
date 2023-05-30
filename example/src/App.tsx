/* eslint-disable react-native/no-inline-styles */
import * as React from "react"
import { useCallback, useState } from "react"
import { Button } from "react-native"
import TangoWebview, { TANGO_RPC_WEBVIEW_SCRIPT } from "react-native-tango-webview"

type ClientAPI = {
  sayHi(message: string): Promise<boolean>
  sayHiThroughCallback(cb: (message: string) => void): Promise<void>
}

const HTML = `
<html>
  <body style="background-color:lightgrey;">
    <script>
      ${TANGO_RPC_WEBVIEW_SCRIPT} <!-- OR: <script src="https://unpkg.com/react-native-tango-webview/dist/umd/tango-rpc.mjs"></script> -->

      const myApi = {
        sayHi(message) {
          alert(message)
          return true
        },
        sayHiThroughCallback(cb) {
          cb("Hi from web")
        }
      };
      const server = new TangoRPC.Server(TangoRPC.createWebViewChannel(), myApi)
      server.onConnect(() => console.log("Server Connected"))
    </script>
  </body>
</html>`

export default function App(): JSX.Element {
  const [clientApi, setClientApi] = useState<ClientAPI>()

  const showMessage = useCallback(async () => {
    if (!clientApi) return
    const result = await clientApi.sayHi("Hello World!")
    console.log(result) // true
  }, [clientApi])

  const performCallback = useCallback(async () => {
    if (!clientApi) return
    await clientApi.sayHiThroughCallback(message => console.log("Callback:" + message))
  }, [clientApi])

  return (
    <>
      <TangoWebview style={{ flex: 1 }} onConnect={setClientApi} source={{ html: HTML }} />
      <Button disabled={!clientApi} onPress={showMessage} title="sayHi" />
      <Button disabled={!clientApi} onPress={performCallback} title="doCallback" />
    </>
  )
}
