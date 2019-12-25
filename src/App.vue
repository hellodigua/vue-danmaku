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
                @click="speedChange(1)">减速</button>
        <button class="btn"
                @click="speedChange(2)">增速</button>
      </p>
      <p>字号：
        <button class="btn"
                @click="fontChange(1)">缩小</button>
        <button class="btn"
                @click="fontChange(2)">放大</button>
      </p>
      <p>弹道：
        <input class="ipt"
               type="text"
               v-model="config.channels">
        <button class="btn"
                @click="play('reset')">设置</button>
      </p>
      <p>
        发送：
        <input class="ipt"
               type="text"
               v-model="danmu">
        <button class="btn"
                @click="addDanmu">发送</button>
      </p>
      <p>性能：
        <button class="btn"
                @click="performance('show')">显示</button>
        <button class="btn"
                @click="performance('hide')">隐藏</button>
      </p>
    </section>
    <a href="https://github.com/hellodigua/vue-danmaku"
       class="github-corner"
       aria-label="View source on Github">
      <svg width="80"
           height="80"
           viewBox="0 0 250 250"
           style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;"
           aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
              style="transform-origin: 130px 106px;"
              class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
              class="octo-body"></path>
      </svg>
    </a>
  </div>
</template>

<script>
import Stats from 'stats.js'
import { danmus, danmus1 } from './assets/danmu.js'
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
  components: {
  },
  data() {
    return {
      config: {
        channels: 5,
        loop: true,
        speed: 10,
        fontSize: 20
      },
      danmu: '',
      danmus: danmus,
      danmus1: danmus1
    }
  },
  methods: {
    onInit() {
      this.$refs.danmaku.play()
    },
    onMouseIn() {
      console.log('in')
    },
    onMouseOut() {
      console.log('out')
    },
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
        default: break
      }
    },
    performance(type) {
      if (type === 'show') {
        stats.dom.style.display = 'block'
      } else {
        stats.dom.style.display = 'none'
      }
    },
    speedChange(type) {
      if (type === 1) {
        this.config.speed = ++this.config.speed
      } else {
        this.config.speed = --this.config.speed
      }
      this.$refs.danmaku.reset()
    },
    fontChange(type) {
      if (type === 1) {
        this.config.fontSize = --this.config.fontSize
      } else {
        this.config.fontSize = ++this.config.fontSize
      }
      this.$refs.danmaku.reset()
    },
    addDanmu() {
      if (!this.danmu) return
      this.$refs.danmaku.add(this.danmu)
      this.danmu = ''
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
    .ipt {
      padding: 6px 16px;
      border-radius: 5px;
      outline: none;
      border: none;
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
