<template>
  <div id="app">
    <vue-danmaku ref="danmaku"
      class="demo"
      :danmus="danmus"
      :config="config"
      @inited="onInit"
      @mouseIn="onMouseIn"
      @mouseOut="onMouseOut">
    </vue-danmaku>
    <section class="intro">
      <h1>vue-danmaku</h1>
      <p>非时间流式的弹幕交互组件</p>
    </section>
    <section class="operation">
      <p>播放：
        <button class="btn"
          @click="play('play')">开始</button>
        <button class="btn"
          @click="play('pause')">暂停</button>
        <button class="btn"
          @click="play('stop')">停止</button>
      </p>
      <p>显示：
        <button class="btn"
          @click="play('show')">显示</button>
        <button class="btn"
          @click="play('hide')">隐藏</button>
      </p>
      <p>速度：
        <button class="btn"
          @click="make(4)">减速</button>
        <button class="btn"
          @click="make(4)">增速</button>
      </p>
      <p>字号：
        <button class="btn"
          @click="make(4)">缩小</button>
        <button class="btn"
          @click="make(4)">放大</button>
      </p>
      <p>弹道：
        <input type="text">
        <button class="btn"
          @click="make(4)">设置</button>
      </p>
      <p>
        发送：
        <input type="text">
        <button class="btn"
          @click="make(4)">发送</button>
      </p>
    </section>
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
      // this.$refs.danmaku.play()
    },
    onMouseIn () {
      console.log('in')
    },
    onMouseOut () {
      console.log('out')
    },
    play (type) {
      switch (type) {
        case 'play':
          this.$refs.danmaku.play()
          break
        case 'pause':
          this.$refs.danmaku.pause()
          break
        case 'stop':
          this.$refs.danmaku.stop()
          break
        case 'show':
          this.$refs.danmaku.show()
          break
        case 'hide':
          this.$refs.danmaku.hide()
          break
        default: break
      }
    },
    make (index) {
      switch (index) {
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .demo {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(45deg, #5ac381, #20568b);
  }
  .intro {
    display: inline-block;
    color: #fff;
    text-align: center;
    h1 {
      font-size: 48px;
      line-height: 32px;
    }
  }
  .operation {
    margin-top: 20px;
    color: #fff;
    .btn {
      color: #000;
      background: #fff;
      border: none;
      padding: 6px 16px;
      border-radius: 5px;
      outline: none;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: #f3f7fa;
      }
      &:active {
        background-color: #fff;
      }
    }
  }
}
</style>