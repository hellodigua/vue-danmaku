<template>
  <div ref="container" class="vue-danmaku">
    <div :class="['danmus', { show: !hidden }, { paused: paused }]" ref="dmContainer"></div>
    <slot />
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    // 弹幕列表数据
    danmus: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 轨道数
    channels: {
      type: Number,
      default: 0,
    },
    // 自动播放
    autoplay: {
      type: Boolean,
      default: true,
    },
    // 循环播放
    loop: {
      type: Boolean,
      default: false,
    },
    // 开启弹幕插槽
    slot: {
      type: Boolean,
      default: false,
    },
    // 弹幕刷新频率(ms)
    debounce: {
      type: Number,
      default: 100,
    },
    // 弹幕速度
    speed: {
      type: Number,
      default: 10,
    },
    // 随机轨道注入弹幕
    randomChannel: {
      type: Boolean,
      default: false,
    },
    // 弹幕字号（仅文本模式）
    fontSize: {
      type: Number,
      default: 18,
    },
    // 弹幕垂直间距
    top: {
      type: Number,
      default: 4,
    },
    // 弹幕水平间距
    right: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      $container: null,
      $dmContainer: null,
      container: {
        width: 0, // 容器宽度
        height: 0, // 容器高度
      },
      danmaku: {
        channels: 0, // 轨道数量
        autoplay: true, // 自动播放
        loop: false, // 是否循环
        slot: false, // 是否开启slot
        debounce: 100, // 弹幕刷新频率(ms)
        randomChannel: false, // 随机选择轨道插入
      },
      danmu: {
        height: 0, // 弹幕元素高度
        fontSize: 18, // 弹幕元素字号（slot下不可用）
        speed: 10, // 弹幕速度
        top: 4, // 弹幕垂直间距
        right: 0, // 弹幕水平间距
      },
      danmuList: [],
      timer: null,
      index: 0,
      hidden: false,
      paused: false,
      danChannel: {},
    }
  },
  computed: {},
  watch: {
    danmus: {
      handler(val) {
        this.danmuList = [...val]
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    init() {
      this.initCore()
      this.initConfig()
      if (this.danmaku.autoplay && this.danmuList.length) {
        this.play()
      }
    },
    initCore() {
      this.$container = this.$refs.container
      this.$dmContainer = this.$refs.dmContainer
      this.container = {
        width: this.$container.offsetWidth,
        height: this.$container.offsetHeight,
      }
    },
    initConfig() {
      this.danmuList = [...this.danmus]
      this.danmaku = {
        ...this.danmaku,
        channels: this.channels,
        autoplay: this.autoplay,
        loop: this.loop,
        slot: this.slot,
        debounce: this.debounce,
        randomChannel: this.randomChannel,
      }
      this.danmu = {
        ...this.danmu,
        speed: this.speed,
        fontSize: this.fontSize,
        top: this.top,
        right: this.right,
      }
    },
    play() {
      this.paused = false
      if (!this.timer) {
        this.draw()
      }
    },
    draw() {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (!this.paused) {
            if (this.index > this.danmuList.length - 1) {
              if (this.danmaku.loop) {
                this.index = 0
                this.insert()
              }
              // 播放完成
              this.$emit('done')
            } else {
              this.insert()
            }
          }
        }, this.danmaku.debounce)
      })
    },
    insert() {
      const index = this.danmaku.loop ? this.index % this.danmuList.length : this.index
      let el = document.createElement(`div`)
      if (this.danmaku.slot) {
        el = this.getSlotComponent(index).$el
      } else {
        el.innerHTML = this.danmuList[index]
        el.style.fontSize = `${this.danmu.fontSize}px`
        el.style.lineHeight = `${this.danmu.fontSize}px`
      }
      el.classList.add('dm')
      this.$dmContainer.appendChild(el)
      this.$nextTick(() => {
        if (!this.danmu.height || !this.danmaku.channels) {
          this.danmu.height = el.offsetHeight
          // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
          if (!this.danmaku.channels) {
            this.danmaku.channels = Math.floor(this.container.height / this.danmu.height)
          }
        }
        let channelIndex = this.getChannelIndex(el)
        if (channelIndex >= 0) {
          const width = el.offsetWidth
          const height = this.danmu.height
          el.classList.add('move')
          el.style.animationDuration = `${this.danmu.speed}s`
          el.style.top = channelIndex * (height + this.danmu.top) + 'px'
          el.style.width = width + this.danmu.right + 'px'
          el.style.transform = `translateX(-${this.container.width}px)`
          el.dataset.index = this.index
          el.addEventListener('animationend', () => {
            this.$dmContainer.removeChild(el)
          })
          if (el.classList.length > 0) {
            this.index++
          }
        } else {
          if (el.classList.length > 0) {
            this.$dmContainer.removeChild(el)
          }
        }
      })
    },
    getSlotComponent(index) {
      const that = this
      const DmComponent = Vue.extend({
        props: {
          danmu: [String, Object],
          index: Number,
        },
        render(createElement) {
          return createElement('div', [
            that.$scopedSlots.dm({
              danmu: this.danmu,
              index: this.index,
            }),
          ])
        },
      })

      const ele = new DmComponent({
        propsData: {
          danmu: this.danmuList[index],
          index,
        },
      }).$mount(document.createElement('div'))

      return ele
    },
    getChannelIndex(el) {
      let channels = [...Array(this.danmaku.channels).keys()]

      if (this.danmaku.randomChannel) {
        channels = channels.sort(() => 0.5 - Math.random())
      }
      for (let i of channels) {
        const items = this.danChannel[i]
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            // 安全距离判断
            if (danRight <= (el.offsetWidth - items[j].offsetWidth) * 0.88 || danRight <= 0) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i].push(el)
              el.addEventListener('animationend', () => this.danChannel[i].splice(0, 1))
              return i % this.danmaku.channels
            }
          }
        } else {
          this.danChannel[i] = [el]
          el.addEventListener('animationend', () => this.danChannel[i].splice(0, 1))
          return i % this.danmaku.channels
        }
      }
      return -1
    },
    // 弹幕右侧到屏幕右侧的距离
    getDanRight(el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.$dmContainer.getBoundingClientRect().right + eleWidth
      return this.$dmContainer.getBoundingClientRect().right - eleRight
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    clear() {
      this.clearTimer()
      this.index = 0
    },
    reset() {
      this.$container = null
      this.$dmContainer = null
      this.danmu.height = 0
      this.init()
    },
    stop() {
      this.danChannel = {}
      this.$dmContainer.innerHTML = ''
      this.paused = true
      this.hidden = false
      this.clear()
      this.initConfig()
    },
    pause() {
      this.paused = true
    },
    // 添加弹幕
    add(danmu) {
      const index = this.index % this.danmuList.length
      this.danmuList.splice(index, 0, danmu)
    },
    setChannels(len) {
      this.danmaku.channels = len
    },
    getPlayState() {
      return !this.paused
    },
    show() {
      this.hidden = false
    },
    hide() {
      this.hidden = true
    },
    resize() {
      this.initCore()
      const items = this.$dmContainer.getElementsByClassName('dm')
      for (let i = 0; i < items.length; i++) {
        items[i].style.transform = `translateX(-${this.container.width}px)`
      }
    },
  },
}
</script>
<style lang="scss">
.vue-danmaku {
  position: relative;
  overflow: hidden;
  .danmus {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &.show {
      opacity: 1;
    }
    &.paused {
      .dm.move {
        animation-play-state: paused;
      }
    }
    .dm {
      position: absolute;
      right: 0;
      font-size: 20px;
      color: #fff;
      white-space: pre;
      transform: translateX(100%);
      &.move {
        will-change: transform;
        animation-name: moveLeft;
        animation-timing-function: linear;
        animation-play-state: running;
      }
      &.pause {
        animation-play-state: paused;
        z-index: 10;
      }
    }
    @keyframes moveLeft {
      from {
        transform: translateX(100%);
      }
    }
    @-webkit-keyframes moveLeft {
      from {
        -webkit-transform: translateX(100%);
      }
    }
  }
}
</style>
