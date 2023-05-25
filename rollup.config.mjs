/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { sync } from "rimraf"

function config({ format, minify, input, ext = "js", file }) {
  const isJSON = ext === "json"
  const dir = `lib/${format}/`
  const minifierSuffix = minify ? ".min" : ""
  const sourcemap = !isJSON
  return {
    input: `./comlink-webview-script/${input}.ts`,
    output: {
      name: "Comlink",
      file: file || `${dir}/${input}${minifierSuffix}.${ext}`,
      format,
      inlineDynamicImports: true,
      sourcemap,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: "./tsconfig.comlink.json",
        outputToFilesystem: true,
        compilerOptions: {
          declaration: false,
          sourceMap: true,
          outDir: "lib",
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
      ext === "json"
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

sync("lib")

export default [
  { input: "comlink-webview-script", format: "umd", minify: false },
  { input: "comlink-webview-script", format: "umd", minify: true, ext: "mjs" },
  {
    input: "comlink-webview-script",
    format: "umd",
    minify: true,
    ext: "json",
    file: "src/comlink-webview-script.json",
  },
].map(config)
