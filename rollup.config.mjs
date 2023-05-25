/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { sync } from "rimraf"

function config({ format, minify, input, file }) {
  const isJSON = file.endsWith("json")
  const sourcemap = !isJSON
  return {
    input: `./comlink-webview-script/${input}.ts`,
    output: {
      name: "Comlink",
      file: file,
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
  { input: "comlink-webview-script", format: "umd", minify: false, file: "dist/umd/comlink.js" },
  { input: "comlink-webview-script", format: "umd", minify: true, file: "dist/umd/comlink.mjs" },
  {
    input: "comlink-webview-script",
    format: "umd",
    minify: true,
    ext: "json",
    file: "src/comlink-webview-script.json",
  },
].map(config)
