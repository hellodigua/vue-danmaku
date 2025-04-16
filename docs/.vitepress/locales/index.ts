import { defineConfig } from 'vitepress'
import zh_CN from './zh_CN'
import en_US from './en_US'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: zh_CN.themeConfig,
      description: zh_CN.description,
    },
    'en-US': {
      label: 'English',
      lang: en_US.lang,
      themeConfig: en_US.themeConfig,
      description: en_US.description,
    },
  },
})
