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
          items: [
            { text: '一般用法', link: '/demo/simple' },
            { text: '响应式', link: '/demo/responsive' },
            { text: '悬浮暂停', link: '/demo/suspend' },
            { text: '完整用法', link: '/demo/full-usage' },
          ],
        },
        {
          text: '通用场景',
          items: [
            { text: '直播模式', link: '/demo/live-mode' },
            { text: '时间轴模式', link: '/demo/timeline' },
            { text: '大屏模式', link: '/demo/screen' },
            { text: '性能监控', link: '/demo/performance-monitor' },
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
