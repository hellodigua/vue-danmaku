import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'

export default defineConfig({
  description: '基于 Vue 的弹幕交互组件',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quick-start' },
      { text: '示例Demo', link: '/demo/base' },
      {
        text: pkg.version,
        items: [
          { text: '更新日志', link: 'https://github.com/hellodigua/vue-danmaku/blob/main/CHANGELOG.md' },
          { text: 'Vue2版本', link: 'https://github.com/hellodigua/vue-danmaku/tree/vue2' },
        ],
      },
    ],
    sidebar: {
      '/': [
        {
          text: '使用',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '配置项', link: '/guide/config' },
            { text: '性能', link: '/guide/performance' },
          ],
        },
        {
          text: '示例Demo',
          items: [{ text: 'Danmaku', link: '/demo/base' }],
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
