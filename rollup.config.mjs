/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { sync } from "rimraf"

function config({ format, minify, input, file }) {
  const isJSON = file.endsWith("json")
  const sourcemap = !isJSON
  return {
    input: `./tango-rpc-webview-script/${input}.ts`,
    output: {
      name: "TangoRPC",
      file: file,
      format,
      inlineDynamicImports: true,
      sourcemap,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: "./tsconfig.tango-rpc.json",
        outputToFilesystem: true,
        compilerOptions: {
          declaration: false,
          sourceMap: true,
          outDir: "dist",
        },
      }),
      minify
        ? terser({
            compress: true,
            mangle: true,
            format: {
              comments: false,
            },
          })
        : undefined,
      isJSON
        ? {
            name: "whatever",
            renderChunk(code, chunk) {
              return JSON.stringify(code)
            },
          }
        : undefined,
    ].filter(Boolean),
  }
}

sync("dist")

export default [
  {
    input: "tango-rpc-webview-script",
    format: "umd",
    minify: false,
    file: "dist/umd/tango-rpc.js",
  },
  {
    input: "tango-rpc-webview-script",
    format: "umd",
    minify: true,
    file: "dist/umd/tango-rpc.mjs",
  },
  {
    input: "tango-rpc-webview-script",
    format: "umd",
    minify: true,
    ext: "json",
    file: "src/tango-rpc-webview-script.json",
  },
].map(config)
