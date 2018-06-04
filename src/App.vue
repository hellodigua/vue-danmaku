<template>
  <div id="app">
    <vue-danmaku ref="danmaku" class="demo" :danmus="danmus" :config="config" @inited="onInit" @mouseIn="onMouseIn" @mouseOut="onMouseOut">
      <section class="intro">
        <h1>vue-danmaku</h1>
        <p>非时间流式的弹幕交互组件</p>
      </section>
    </vue-danmaku>
    <button @click="make(1)">开始</button>
    <button @click="make(2)">暂停</button>
    <button @click="make(3)">停止</button>
    <button @click="make(4)">显示</button>
    <button @click="make(5)">隐藏</button>
  </div>
</template>

<script>
import Stats from 'stats.js'
import { danmus, danmus1 } from './assets/danmu.js'
var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

function animate () {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      config: {
        channels: 5,
        loop: true
      },
      danmus: danmus,
      danmus1: danmus1
    }
  },
  methods: {
    onInit () {
      this.$refs.danmaku.play()
    },
    onMouseIn () {
      console.log('in')
    },
    onMouseOut () {
      console.log('out')
    },
    make (index) {
      switch (index) {
        case 1:
          this.$refs.danmaku.play()
          break
        case 2:
          this.$refs.danmaku.pause()
          break
        case 3:
          this.$refs.danmaku.stop()
          break
        case 4:
          this.$refs.danmaku.show()
          break
        case 5:
          this.$refs.danmaku.hide()
          break
        default: break
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(45deg, #5ac381, #20568b);
  .container {
    margin: 0 20%;
  }
  .demo {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .intro {
      color: #fff;
      text-align: center;
      margin-bottom: 20%;
      h1 {
        font-size: 3em;
      }
    }
  }
}
</style>