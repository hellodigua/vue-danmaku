import vueDanmaku from './main.vue'

vueDanmaku.install = function(Vue) {
  Vue.component('vueDanmaku', vueDanmaku)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueDanmaku)
}

export default vueDanmaku
