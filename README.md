# react-native-comlink-webview

React Native library that enables easy communication between a WebView and React Native components using the Comlink framework. It simplifies the integration of WebView into React Native applications and facilitates data exchange and method invocation between the two environments.

## Installation

```sh
npm install react-native-comlink-webview
```
or
```sh
yarn add react-native-comlink-webview
```

## Usage

```tsx
// ...
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

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT