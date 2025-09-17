<template>
  <vue-danmaku ref="danmaku" class="demo" v-model:danmus="danmus" isSuspend v-bind="config">
    <!-- 容器slot -->
    <div></div>
    <!-- 弹幕slot -->
    <template v-slot:danmu="{ danmu, index }">
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
        <span class="title">播放：</span>
        <button class="btn" @click="handleInvoke('play')">播放</button>
        <button class="btn" @click="handleInvoke('pause')">暂停</button>
        <button class="btn" @click="handleInvoke('stop')">停止</button>
      </p>
      <p>
        <span class="title">显示：</span>
        <button class="btn" @click="handleInvoke('show')">显示</button>
        <button class="btn" @click="handleInvoke('hide')">隐藏</button>
      </p>
      <p>
        <span class="title">速度：</span>
        <button class="btn" @click="handleChange('speeds', -10)">减速</button>
        <button class="btn" @click="handleChange('speeds', 10)">增速</button>
        <span>速度：{{ config.speeds }}像素/s</span>
      </p>
      <p>
        <span class="title">轨道：</span>
        <button class="btn" @click="handleChange('channels', -1)">-1</button>
        <button class="btn" @click="handleChange('channels', 1)">+1</button>
        <button class="btn" @click="handleChange('channels', -config.channels)">填满</button>
        <span>轨道：{{ config.channels }}</span>
      </p>
      <p>
        <span class="title">刷新频率：</span>
        <button class="btn" @click="handleChange('debounce', -currentDebounceStep)">
          -{{ currentDebounceStep }}ms
        </button>
        <button class="btn" @click="handleChange('debounce', currentDebounceStep)">+{{ currentDebounceStep }}ms</button>
        <span>频率：{{ config.debounce }}ms</span>
      </p>
      <p>
        <span class="title">性能模式：</span>
        <button class="btn" @click="togglePerformanceMode">{{ config.performanceMode ? '关闭' : '开启' }}</button>
        <span>{{ config.performanceMode ? ' requestAnimationFrame' : 'CSS Animation' }}</span>
      </p>
      <p>
        <span class="title">镜像：</span>
        <button class="btn" @click="toggleMirror">{{ config.mirror ? '关闭' : '开启' }}</button>
        <span>{{ config.mirror ? '已开启' : '已关闭' }}</span>
      </p>
      <p>
        <span class="title">随机轨道：</span>
        <button class="btn" @click="toggleRandomChannel">{{ config.randomChannel ? '关闭' : '开启' }}</button>
        <span>{{ config.randomChannel ? '已开启' : '已关闭' }}</span>
      </p>
      <p>
        <span class="title">发送：</span>
        <input class="ipt" type="text" v-model="danmuMsg" />
        <button class="btn" @click="addDanmu">发送</button>
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
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { getDanmuData } from './assets/danmu.js'
import VueDanmaku from './lib/Danmaku.vue'

export default defineComponent({
  components: {
    VueDanmaku,
  },
  props: {},
  setup(props) {
    const danmaku = ref<any>(null)
    const danmus = ref<any[]>(getDanmuData())
    const danmuMsg = ref<string>('')
    let timer: number = 0
    const config = reactive({
      channels: 8, // 轨道数量，为0则弹幕轨道数会撑满容器
      loop: true, // 是否开启弹幕循环
      speeds: 200, // 弹幕速度，实际为弹幕滚动完一整屏的秒数，值越小速度越快
      top: 10, // 弹幕轨道间的垂直间距
      right: 0, // 同一轨道弹幕的水平间距
      debounce: 100, // 弹幕刷新频率（多少毫秒插入一条弹幕，建议不小于50）
      randomChannel: true, // 随机弹幕轨道
      performanceMode: true, // 性能模式，使用requestAnimationFrame代替CSS动画
      autoResize: true, // 启用内部resize监听
      mirror: false,
    })

    function handleInvoke(type: string) {
      switch (type) {
        case 'play':
          danmaku.value.play()
          break
        case 'pause':
          danmaku.value.pause()
          break
        case 'stop':
          danmaku.value.stop()
          break
        case 'show':
          danmaku.value.show()
          break
        case 'hide':
          danmaku.value.hide()
          break
        case 'reset':
          danmaku.value.reset()
          break
        default:
          break
      }
    }
    function handleChange(type: string, val: number) {
      if (type === 'speeds') {
        if (config.speeds <= 10 && val === -10) {
          return
        }
        config.speeds += val
      }

      if (type === 'channels') {
        if (!config.channels && val === -1) {
          return
        }
        config.channels += val
      }

      if (type === 'debounce') {
        const step = getDebounceStep(config.debounce)
        const newValue = config.debounce + val

        if (newValue < 10) {
          return
        }

        config.debounce = newValue

        // 自动重启弹幕以使新频率生效
        if (danmaku.value) {
          danmaku.value.reset()
          danmaku.value.play()
        }
      }
    }

    function getDebounceStep(currentValue: number): number {
      if (currentValue <= 100) {
        return 10 // 10-100ms范围用10ms步长
      } else if (currentValue <= 500) {
        return 50 // 100-500ms范围用50ms步长
      } else {
        return 100 // 500ms+范围用100ms步长
      }
    }

    const currentDebounceStep = computed(() => getDebounceStep(config.debounce))

    function addDanmu() {
      if (!danmuMsg.value) return
      const _danmuMsg = {
        avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
        name: '你',
        text: danmuMsg.value,
      }

      danmaku.value.addDanmu(_danmuMsg)
      danmuMsg.value = ''
    }

    /**
     * 切换性能模式
     */
    function togglePerformanceMode() {
      config.performanceMode = !config.performanceMode
    }
    /**
     * 切换镜像
     */
    function toggleMirror() {
      config.mirror = !config.mirror
    }

    /**
     * 切换随机轨道
     */
    function toggleRandomChannel() {
      config.randomChannel = !config.randomChannel
    }

    return {
      danmaku,
      danmus,
      config,
      danmuMsg,
      currentDebounceStep,

      handleInvoke,
      handleChange,
      addDanmu,
      togglePerformanceMode,
      toggleMirror,
      toggleRandomChannel,
    }
  },
})
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
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
      z-index: 10;
      color: #fff;
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
      min-height: 300px;
      .title {
        width: 80px;
        display: inline-block;
        text-align: right;
      }
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
    .main {
      transform: scale(0.9);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .github-corner:hover .octo-arm {
      animation: none;
    }
    .github-corner .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
  }
}
</style>
