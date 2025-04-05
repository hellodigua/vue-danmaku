import { createApp } from 'vue'
import Demo from './Demo.vue'

const app = createApp(Demo)

app.mount('#app')

window.app = app

declare global {
  interface Window {
    app: typeof app
  }
}
