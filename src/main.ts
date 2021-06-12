import { createApp } from 'vue'
import App from './App.vue'
import VueDanmaku from './lib/VueDanmaku.vue'

const app = createApp(App)

app.component(VueDanmaku.name, VueDanmaku)
app.mount('#app')

window.app = app

declare global {
  interface Window {
    app: typeof app
  }
}
