import { defineConfig } from 'vitepress'

export default defineConfig({
  description: '基于 Vue 的弹幕交互组件',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quick-start' },
      { text: '示例Demo', link: '/guide/demo-base' },
      { text: 'Vue2版本', link: 'https://github.com/hellodigua/vue-danmaku/tree/vue2' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '使用',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '配置项', link: '/guide/config' },
            { text: '更新日志', link: '/guide/changelog' },
          ],
        },
        {
          text: '示例',
          items: [
            { text: 'Danmaku', link: '/guide/danmaku' },
            { text: '性能监控', link: '/guide/performance' },
          ],
        },
      ],
    },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '深色模式',
    returnToTopLabel: '回到顶部',
    outline: {
      label: '目录',
    },
    editLink: {
      pattern: 'https://github.com/hellodigua/vue-danmaku/edit/main/:path',
      text: '在 GitHub 中编辑本页',
    },
  },
})
