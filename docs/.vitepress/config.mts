import { defineConfig } from 'vitepress'
import locales from './locales'
import { mdPlugin } from './plugins/demo'

export default defineConfig({
  title: 'vue-danmaku',
  description: '基于Vue3的弹幕交互组件',
  base: '/vue-danmaku-docs/',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'favicon.ico' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@200;400;500&family=Inter:wght@200;400;500;600',
        rel: 'stylesheet',
      },
    ],
  ],
  locales: locales.locales,
  themeConfig: {
    // logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/hellodigua/vue-danmaku-docs/',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/hellodigua/vue-danmaku',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present',
    },
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
})
