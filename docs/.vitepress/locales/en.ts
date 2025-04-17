import { defineConfig } from 'vitepress'

export default defineConfig({
  description: 'A danmaku component for Vue',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en/guide/quick-start' },
      { text: 'Demo', link: '/en/guide/demo-base' },
      { text: 'For Vue2', link: 'https://github.com/hellodigua/vue-danmaku/tree/vue2' },
    ],
    sidebar: {
      '/en/guide/': [
        {
          text: 'How to use',
          items: [
            { text: 'QuickStart', link: '/en/guide/quick-start' },
            { text: 'Config', link: '/en/guide/config' },
            { text: 'Changelog', link: '/en/guide/changelog' },
          ],
        },
        {
          text: 'Demo',
          items: [
            { text: 'Danmaku', link: '/en/guide/danmaku' },
            { text: 'Performance', link: '/en/guide/performance' },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/hellodigua/vue-danmaku/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
