import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export default defineConfig({
  description: 'A danmaku component for Vue',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en/guide/quick-start' },
      { text: 'Demo', link: '/en/demo/base' },
      {
        text: pkg.version,
        items: [
          { text: 'Changelog', link: 'https://github.com/hellodigua/vue-danmaku/blob/main/CHANGELOG_en.md' },
          { text: 'For Vue2', link: 'https://github.com/hellodigua/vue-danmaku/tree/vue2' },
        ],
      },
    ],
    sidebar: {
      '/en/': [
        {
          text: 'Guide',
          items: [
            { text: 'QuickStart', link: '/en/guide/quick-start' },
            { text: 'Config', link: '/en/guide/config' },
            { text: 'Performance', link: '/en/guide/performance' },
          ],
        },
        {
          text: 'Demo',
          items: [{ text: 'Base', link: '/en/demo/base' }],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/hellodigua/vue-danmaku/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
