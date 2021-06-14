import { App } from 'vue'
import VueDanmaku from './main.vue'

VueDanmaku.install = (app: App): void => {
  app.component(VueDanmaku.name, VueDanmaku)
}

export default VueDanmaku
