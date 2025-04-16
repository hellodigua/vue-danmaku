import Unocss from 'unocss/vite'
import { resolve } from 'path'
// import { MarkdownTransform } from './.vitepress/plugins/md-transform'

export default {
  plugins: [Unocss()],
  resolve: {
    alias: {
      'vue-danmaku': resolve(__dirname, '../src/lib'),
    },
  },
}
