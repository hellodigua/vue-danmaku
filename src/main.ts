import { createApp } from 'vue'
import App from './App.vue'
// import VueDanmaku from './lib'

const app = createApp(App)

// app.use(VueDanmaku)
app.mount('#app')

window.app = app

declare global {
  interface Window {
    app: typeof app
  }
}
