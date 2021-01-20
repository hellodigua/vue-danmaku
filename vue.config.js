const WebpackCdnPlugin = require('webpack-cdn-plugin')

const isBuildPackage = process.env.VUE_APP_BUILD_MODE === 'package'

const isBuildDemo = process.env.NODE_ENV === 'production' && !isBuildPackage

module.exports = {
  parallel: false,
  publicPath: isBuildDemo ? '/vue-danmaku/' : '/',
  outputDir: isBuildPackage ? 'dist' : 'docs',
  chainWebpack: (config) => {
    if (!isBuildPackage) {
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
  configureWebpack: {
    plugins: isBuildPackage
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
