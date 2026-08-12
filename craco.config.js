const CracoEsbuildPlugin = require('craco-esbuild')
const webpack = require('webpack')

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        esbuildMinimizerOptions: {
          // es2018+ needed: @anthropic-ai/sdk ships async generators,
          // which esbuild cannot transform down to es2015.
          target: 'es2018',
          css: true, //  OptimizeCssAssetsWebpackPlugin being replaced by esbuild.
        },
      },
    },
  ],
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          process: { env: {}, browser: {} },
        }),
        // Strip the "node:" scheme so the resolve.fallback entries below
        // apply to node:fs / node:path / ... imports (@anthropic-ai/sdk).
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '')
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          fs: false,
          tls: false,
          net: false,
          path: false,
          zlib: false,
          http: false,
          https: false,
          stream: false,
          crypto: false,
          buffer: false,
        },
      },
    },
  },
}
