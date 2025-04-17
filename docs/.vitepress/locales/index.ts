import { defineConfig } from 'vitepress'
import zh_CN from './zh_CN'
import en from './en'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: zh_CN.themeConfig,
      description: zh_CN.description,
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: en.themeConfig,
      description: en.description,
    },
  },
})
