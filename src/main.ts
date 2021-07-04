import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')

window.app = app

declare global {
  interface Window {
    app: typeof app
  }
}
