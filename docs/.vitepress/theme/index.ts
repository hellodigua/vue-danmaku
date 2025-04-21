import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { globals } from '../components/index'
import 'uno.css'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
} as Theme
