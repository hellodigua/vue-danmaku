const WebpackCdnPlugin = require('webpack-cdn-plugin')

const isPackage = process.env.VUE_APP_BUILD_MODE === 'package'

module.exports = {
  parallel: false,
  publicPath: process.env.NODE_ENV === 'production' && isPackage ? '/' : '/vue-danmaku/',
  outputDir: process.env.VUE_APP_BUILD_MODE === 'package' ? 'dist' : 'docs',
  chainWebpack: (config) => {
    if (process.env.VUE_APP_BUILD_MODE !== 'package') {
      config.resolve.alias.set('~', __dirname)
    } else {
      config.output.libraryExport('default')
      config.externals({
        vue: {
          commonjs: 'vue',
          commonjs2: 'vue',
          root: 'Vue',
          amd: 'vue',
        },
      })
    }
  },
  css: { extract: !!process.env.NO_EXTRACT_CSS },
  configureWebpack: {
    plugins: isPackage
      ? []
      : [
        new WebpackCdnPlugin({
          modules: [{ name: 'vue', var: 'Vue', path: 'dist/vue.runtime.min.js' }],
          publicPath: '/node_modules',
          prodUrl: '//cdn.jsdelivr.net/npm/:name@:version/:path',
          crossOrigin: 'anonymous',
        }),
      ],
  },
}
