import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  description: '基于 Vue 的弹幕交互组件',

  themeConfig: {
    nav: [
      { text: '配置项', link: '/zh-CN/components/config' },
      { text: 'Demo', link: '/zh-CN/components/demo' },
    ],
    sidebar: {
      '/zh-CN/components/': [
        {
          text: '使用',
          items: [
            { text: '快速开始', link: '/zh-CN/components/quick-start' },
            { text: '配置项', link: '/zh-CN/components/config' },
            { text: '更新日志', link: '/zh-CN/components/changelog' },
          ],
        },
        {
          text: '示例',
          items: [
            { text: 'Danmaku', link: '/zh-CN/components/danmaku' },
            { text: '性能监控', link: '/zh-CN/components/performance' },
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
