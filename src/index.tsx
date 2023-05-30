import TangoWebview from "./tango-webview"

import { createWebViewChannel } from "./tango-rpc-webview-script"

import * as _TangoRPC from "tango-rpc"

export * from "./tango-webview"

export const TangoRPC = {
  ..._TangoRPC,
  createWebViewChannel,
}

export default TangoWebview
