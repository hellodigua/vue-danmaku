import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  description: 'A danmaku component for Vue',

  themeConfig: {
    nav: [
      { text: 'Config', link: '/en-US/components/config' },
      { text: 'Demo', link: '/en-US/components/demo' },
    ],
    sidebar: {
      '/en-US/components/': [
        {
          text: 'How to use',
          items: [
            { text: 'QuickStart', link: '/en-US/components/quick-start' },
            { text: 'Config', link: '/en-US/components/config' },
            { text: 'Changelog', link: '/en-US/components/changelog' },
          ],
        },
        {
          text: 'Demo',
          items: [
            { text: 'Danmaku', link: '/en-US/components/danmaku' },
            { text: 'Performance', link: '/en-US/components/performance' },
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
