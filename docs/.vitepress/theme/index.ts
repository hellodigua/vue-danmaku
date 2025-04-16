import DefaultTheme from 'vitepress/theme'
// import Demo from '../components/Demo.vue'
// import DemoWrapper from '../components/DemoWrapper.vue'
import { globals } from '../components/index'
import 'uno.css'
import '@unocss/reset/tailwind.css'

import type { Theme } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    // app.component('Demo', Demo)
    // app.component('DemoWrapper', DemoWrapper)
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
} as Theme
