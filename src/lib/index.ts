import { App } from 'vue'
import VueDanmaku from './Danmaku.vue'

VueDanmaku.install = (app: App): void => {
  app.component(VueDanmaku.name, VueDanmaku)
}

export default VueDanmaku
