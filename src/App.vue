<template>
  <div id="app">
    <vue-danmaku ref="danmaku" class="demo" :danmus="danmus" v-bind="config">
      <!-- 容器slot -->
      <div></div>
      <!-- 弹幕slot -->
      <template v-slot:dm="{ index, danmu }">
        <div class="danmu-item">
          <img class="img" :src="danmu.avatar" />
          <span>{{ index }}{{ danmu.name }}：</span>
          <span>{{ danmu.text }}</span>
        </div>
      </template>
    </vue-danmaku>
    <div class="main">
      <div class="intro">
        <h1>vue-danmaku</h1>
        <p>基于 Vue.js 的弹幕交互组件</p>
      </div>
      <div class="action">
        <p>
          播放：
          <button class="btn" @click="play('play')">播放</button>
          <button class="btn" @click="play('pause')">暂停</button>
          <button class="btn" @click="play('stop')">停止</button>
        </p>
        <p>
          模式：
          <button class="btn" @click="switchSlot(true)">弹幕 slot</button>
          <button class="btn" @click="switchSlot(false)">普通文本</button>
        </p>
        <!-- <p>
          循环：
          <button class="btn" @click="play('show')">开启</button>
          <button class="btn" @click="play('hide')">关闭</button>
        </p> -->
        <p>
          显示：
          <button class="btn" @click="play('show')">显示</button>
          <button class="btn" @click="play('hide')">隐藏</button>
        </p>
        <p>
          速度：
          <button class="btn" @click="speedsChange(-10)">减速</button>
          <button class="btn" @click="speedsChange(10)">增速</button>
          <span>当前速度：{{ config.speeds }}像素/s</span>
        </p>
        <p>
          字号：
          <button class="btn" :disabled="config.useSlot" @click="fontChange(-1)">缩小</button>
          <button class="btn" :disabled="config.useSlot" @click="fontChange(1)">放大</button>
          <span>当前字号：{{ config.fontSize }}px</span>
        </p>
        <p>
          轨道：
          <button class="btn" @click="channelChange(-1)">-1</button>
          <button class="btn" @click="channelChange(1)">+1</button>
          <button class="btn" @click="channelChange(-config.channels)">填满</button>
          <span>当前轨道：{{ config.channels }}</span>
        </p>
        <p>
          发送：
          <input class="ipt" type="text" v-model="danmuMsg" />
          <button class="btn" @click="addDanmu">发送</button>
        </p>
        <p>
          性能：
          <button class="btn" @click="setPerformance('block')">显示</button>
          <button class="btn" @click="setPerformance('none')">隐藏</button>
        </p>
      </div>
    </div>
    <a
      href="https://github.com/hellodigua/vue-danmaku"
      class="github-corner"
      target="_blank"
      aria-label="View source on Github"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="fill: #151513; color: #fff; position: absolute; top: 0; border: 0; right: 0"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px"
          class="octo-arm"
        ></path>
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        ></path>
      </svg>
    </a>
  </div>
</template>

<script>
import Stats from 'stats.js'
import { danmus, customDanmus } from './assets/danmu.js'
var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
stats.dom.style.display = 'none'

function animate() {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
export default {
  name: 'App',
  components: {},
  data() {
    return {
      danmus,
      config: {
        channels: 5, // 轨道数量，为0则弹幕轨道数会撑满容器
        useSlot: false, // 是否开启slot
        loop: true, // 是否开启弹幕循环
        speeds: 200, // 弹幕速度，实际为每秒弹幕走过的像素距离
        fontSize: 20, // 文本模式下的字号
        top: 10, // 弹幕轨道间的垂直间距
        right: 0, // 同一轨道弹幕的水平间距
        debounce: 100, // 弹幕刷新频率（多少毫秒插入一条弹幕，建议不小于50）
      },
      danmuMsg: '',
    }
  },
  created() {
    // 手机端使用海量弹幕效果
    if (screen.width < 750) {
      this.config.channels = 0
    }
  },
  mounted() {
    window.onresize = () => this.resizeHandler()
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    play(type) {
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
        case 'reset':
          this.$refs.danmaku.reset()
          break
        default:
          break
      }
    },
    switchSlot(slot) {
      this.config.useSlot = slot
      this.danmus = slot ? customDanmus : danmus
      setTimeout(() => {
        this.$refs.danmaku.reset()
        this.$refs.danmaku.play()
      })
    },
    setPerformance(type) {
      stats.dom.style.display = type
    },
    speedsChange(val) {
      if (this.config.speeds <= 10 && val === -10) {
        return
      }
      this.config.speeds += val
      this.$refs.danmaku.reset()
    },
    fontChange(val) {
      this.config.fontSize += val
      this.$refs.danmaku.reset()
    },
    channelChange(val) {
      if (!this.config.channels && val === -1) {
        return
      }
      this.config.channels += val
      this.$refs.danmaku.setChannels(this.config.channels)
    },
    resizeHandler() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.danmaku.resize()
      }, 500)
    },
    addDanmu() {
      if (!this.danmuMsg) return
      const danmuMsg = this.config.useSlot
        ? {
            avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
            name: '你',
            text: this.danmuMsg,
          }
        : this.danmuMsg
      this.$refs.danmaku.add(danmuMsg)
      this.danmuMsg = ''
    },
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  .demo {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: linear-gradient(45deg, #5ac381, #20568b);
    .danmu-item {
      display: flex;
      align-items: center;
      .img {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
  .main {
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .intro {
      display: inline-block;
      color: #fff;
      text-align: center;
      text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.4);
      h1 {
        font-size: 48px;
        line-height: 32px;
      }
    }
    .action {
      margin-top: 20px;
      color: #fff;
      min-width: 360px;
      .btn {
        color: #000;
        background: #fff;
        border: none;
        padding: 6px 16px;
        margin-right: 8px;
        border-radius: 5px;
        min-height: 31px;
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
      .ipt {
        width: 130px;
        padding: 8px 16px;
        border-radius: 5px;
        outline: none;
        border: none;
        margin-right: 8px;
      }
    }
  }
  .github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }

  @keyframes octocat-wave {
    0%,
    100% {
      transform: rotate(0);
    }
    20%,
    60% {
      transform: rotate(-25deg);
    }
    40%,
    80% {
      transform: rotate(10deg);
    }
  }

  @media (max-width: 500px) {
    .github-corner:hover .octo-arm {
      animation: none;
    }
    .github-corner .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
  }
}
</style>
