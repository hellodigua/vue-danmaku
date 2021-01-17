import Vue from 'vue'
import App from './App.vue'
import VueDanmaku from './lib/'

Vue.use(VueDanmaku)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
})
