# react-native-tango-webview

React Native library that enables easy communication between a WebView and React Native components using the [tango-rpc](https://github.com/mattijsf/tango-rpc) library. It simplifies the integration of WebView into React Native applications and facilitates data exchange and method invocation between the two environments using a typescript interface.

## Installation

```sh
npm install react-native-tango-webview
```
or
```sh
yarn add react-native-tango-webview
```

## Usage

```tsx
// ...
import TangoWebview, { TANGO_RPC_WEBVIEW_SCRIPT } from "react-native-tango-webview"

type ClientAPI = {
  sayHi(message: string): Promise<boolean>
  doCallback(cb: (message: string) => void): Promise<void>
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

      const server = new TangoRPC.Server(createWebViewChannel(), myApi)
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
    await clientApi.doCallback(message => console.log("Callback:" + message))
  }, [clientApi])

  return (
    <>
      <TangoWebview style={{ flex: 1 }} onConnect={setClientApi} source={{ html: HTML }} />
      <Button disabled={!clientApi} onPress={showMessage} title="sayHi" />
      <Button disabled={!clientApi} onPress={performCallback} title="doCallback" />
    </>
  )
}

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT