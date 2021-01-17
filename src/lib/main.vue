<template>
  <div ref="danmaku" class="vue-danmaku" @mouseenter="mouseIn" @mouseleave="mouseOut">
    <div :class="['danmus', { show: !hidden }, { paused: paused }]" ref="danmus"></div>
    <slot name="content" />
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    danmus: {
      type: Array,
      required: true,
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      container: null,
      isActive: false,
      timer: null,
      $danmaku: null,
      $danmus: null,
      danmaku: {
        danmus: [],
        width: 0, // danmaku宽度
        channels: 0, // 轨道数量
        loop: false, // 是否循环
        slot: false, // 是否开启slot
        debounce: 50, // 弹幕刷新频率(ms)
      },
      danmu: {
        fontSize: 18, // 弹幕元素字号（slot下不可用）
        height: 0, // 弹幕元素高度
        speed: 10, // 弹幕速度
        top: 4, // 弹幕垂直间距
        right: 2, // 弹幕水平间距
      },
      index: 0,
      hidden: false,
      paused: false,
      danChannel: {},
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    init() {
      this.initCore()
      this.initConfig()
      this.$emit('inited')
    },
    mouseIn() {
      this.$emit('mouseIn')
    },
    mouseOut() {
      this.$emit('mouseOut')
    },
    initCore() {
      this.$danmaku = this.$refs.danmaku
      this.$danmus = this.$refs.danmus
      this.danmaku.width = this.$danmaku.offsetWidth
      this.danmaku.height = this.$danmaku.offsetHeight
    },
    initConfig() {
      const {
        channels = 0,
        loop = false,
        slot = false,
        debounce = 50,
        speed = 10,
        fontSize = 18,
        top = 4,
        right = 2,
      } = this.config
      this.danmaku.danmus = [...this.danmus]
      this.danmaku.channels = Number(channels)
      this.danmaku.loop = Boolean(loop)
      this.danmaku.slot = Boolean(slot)
      this.danmaku.debounce = Number(debounce)
      this.danmu.speed = Number(speed)
      this.danmu.fontSize = Number(fontSize)
      this.danmu.top = Number(top)
      this.danmu.right = Number(right)
    },
    play() {
      if (!this.timer) {
        this.draw()
      }
      if (this.paused) {
        this.paused = false
      }
    },
    draw() {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (!this.paused) {
            if (this.index > this.danmaku.danmus.length - 1) {
              this.danmaku.loop ? this.insert() : this.clear()
            } else {
              this.insert()
            }
          }
        }, this.danmaku.debounce)
      })
    },
    insert() {
      const index = this.danmaku.loop ? this.index % this.danmaku.danmus.length : this.index
      let el = document.createElement(`div`)
      if (this.danmaku.slot) {
        el = this.getSlotComponent(index).$el
      } else {
        el.innerHTML = this.danmaku.danmus[index]
        el.style.fontSize = `${this.danmu.fontSize}px`
        el.style.lineHeight = `${this.danmu.fontSize}px`
      }
      el.classList.add('dm')
      el.setAttribute('index', this.index)
      this.$danmus.appendChild(el)
      this.$nextTick(() => {
        if (!this.danmu.height || !this.danmaku.channels) {
          this.danmu.height = el.offsetHeight
          // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
          if (!this.danmaku.channels) {
            this.danmaku.channels = Math.floor(this.danmaku.height / this.danmu.height)
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
          el.style.transform = `translateX(-${this.danmaku.width}px)`
          el.addEventListener('animationend', () => {
            this.$danmus.removeChild(el)
          })
          if (el.classList.length > 0) {
            this.index++
          }
        } else {
          if (el.classList.length > 0) {
            this.$danmus.removeChild(el)
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
            that.$scopedSlots.default({
              danmu: this.danmu,
              index: this.index,
            }),
          ])
        },
      })

      const ele = new DmComponent({
        propsData: {
          danmu: this.danmaku.danmus[index],
          index,
        },
      }).$mount(document.createElement('div'))

      return ele
    },
    getChannelIndex(el) {
      const tmp = this.$danmus.offsetWidth / ((this.$danmus.offsetWidth + el.offsetWidth) / 6)
      for (let i = 0; i < this.danmaku.channels; i++) {
        const items = this.danChannel[i]
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            if (
              danRight <=
                this.$danmus.offsetWidth - tmp * ((this.$danmus.offsetWidth + parseInt(items[j].offsetWidth)) / 6) ||
              danRight <= 0
            ) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i].push(el)
              el.addEventListener('animationend', () => {
                this.danChannel[i].splice(0, 1)
              })
              return i % this.danmaku.channels
            }
          }
        } else {
          this.danChannel[i] = [el]
          el.addEventListener('animationend', () => {
            this.danChannel[i].splice(0, 1)
          })
          return i % this.danmaku.channels
        }
      }
      return -1
    },
    // 弹幕到右侧的距离
    getDanRight(el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.$danmus.getBoundingClientRect().right + eleWidth
      return this.$danmus.getBoundingClientRect().right - eleRight
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
      this.$danmaku = null
      this.$danmus = null
      this.danmu.height = 0
      this.init()
    },
    stop() {
      this.danChannel = {}
      this.$refs.danmus.innerHTML = ''
      this.paused = true
      this.hidden = false
      this.clear()
    },
    pause() {
      this.paused = true
    },
    // 添加弹幕
    add(danmu) {
      const index = this.index % this.danmaku.danmus.length
      this.danmaku.danmus.splice(index, 0, danmu)
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
      this.initConfig()
      const items = this.$danmaku.getElementsByClassName('dm')
      for (let i = 0; i < items.length; i++) {
        items[i].style.transform = `translateX(-${this.danmaku.width}px)`
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
