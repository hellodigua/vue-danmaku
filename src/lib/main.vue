<template>
  <div ref="danmaku"
       class="vue-danmaku"
       @mouseenter="mouseIn"
       @mouseleave="mouseOut">
    <div :class="['danmus', {'show': !hidden}, {'paused': paused}]"
         ref="danmus"></div>
    <slot name="content" />
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    danmus: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
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
        debounce: 50 // 弹幕刷新频率(ms)
      },
      danmu: {
        height: 0,
        fontSize: 18,
        speed: 10
      },
      index: 0,
      hidden: false,
      paused: false,
      danChannel: {}
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.init()
      this.$emit('inited')
    })
  },
  methods: {
    init() {
      this.initCore()
      this.initConfig()
    },
    reset() {
      this.$danmaku = null
      this.$danmus = null
      this.init()
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
      this.danmaku.danmus = this.danmus
      const { channels = 0, loop = false, slot = false, debounce = 50, speed = 10, fontSize = 18 } = this.config
      this.danmaku.channels = Number(channels)
      this.danmaku.loop = loop
      this.danmaku.slot = slot
      this.danmaku.debounce = debounce
      this.danmu.speed = Number(speed)
      this.danmu.fontSize = Number(fontSize)
    },
    play() {
      if (this.paused) {
        this.paused = false
        return
      }
      if (!this.timer) {
        this.draw()
      }
    },
    draw() {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (this.index > this.danmus.length - 1) {
            this.danmaku.loop ? this.insert() : this.clear()
          } else {
            this.insert()
          }
        }, this.danmaku.debounce)
      })
    },
    insert() {
      const index = this.danmaku.loop ? this.index % this.danmus.length : this.index
      let el = document.createElement(`div`)
      if (this.danmaku.slot) {
        el = this.getSlotComponent(index).$el
      } else {
        el.innerHTML = this.danmus[index]
      }
      el.classList.add('dm', 'move')
      el.style.animationDuration = `${this.danmu.speed}s`
      el.style.fontSize = `${this.danmu.fontSize}px`
      el.setAttribute('index', this.index)
      this.$danmus.appendChild(el)
      this.$nextTick(() => {
        if (!this.danmu.height || !this.danmu.width || !this.danmaku.channels) {
          this.danmu.height = el.offsetHeight
          // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
          if (!this.danmaku.channels) {
            this.danmaku.channels = Math.floor(this.danmaku.height / this.danmu.height)
          }
        }
        let channelIndex = this.getChannelIndex(el)
        if (channelIndex >= 0) {
          const width = el.offsetWidth
          const height = this.danmu.height > this.danmu.fontSize ? this.danmu.height : this.danmu.fontSize + 4
          el.style.top = channelIndex * height + 'px'
          el.style.width = width + 1 + 'px'
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
          index: Number
        },
        render(createElement) {
          return createElement('div', [
            that.$scopedSlots.default({
              danmu: this.danmu,
              index: this.index
            })
          ])
        }
      })

      const ele = new DmComponent({
        propsData: {
          danmu: this.danmus[index],
          index
        }
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
            if (danRight <= this.$danmus.offsetWidth - tmp * ((this.$danmus.offsetWidth + parseInt(items[j].offsetWidth)) / 6) || danRight <= 0) {
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
    // 添加弹幕
    add(danmu) {
      const index = this.index % this.danmaku.danmus.length
      this.danmaku.danmus.splice(index, 0, danmu)
    },
    pause() {
      this.paused = true
    },
    stop() {
      this.danChannel = {}
      this.$refs.danmus.innerHTML = ''
      this.paused = false
      this.hidden = false
      this.clear()
    },
    getPlayStatus() {
      return !this.paused
    },
    clear() {
      clearInterval(this.timer)
      this.timer = null
      this.index = 0
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
    }
  }
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
    z-index: 1000;
    &.show {
      opacity: 1;
    }
    &.paused {
      .dm.move {
        animation-play-state: paused;
      }
    }
    p {
      position: absolute;
      color: #fff;
      text-shadow: 1px 1px 1px #000;
      margin: 0;
      white-space: pre;
    }
    .dm {
      position: absolute;
      color: #fff;
      font-size: 18px;
      right: 0;
      top: 8px;
      white-space: pre;
      text-shadow: 1px 1px 2px #001;
      transform: translateX(100%);
      &.move {
        will-change: transform;
        animation-name: danmaku;
        animation-timing-function: linear;
        animation-play-state: running;
      }
    }
    @keyframes danmaku {
      from {
        transform: translateX(100%);
      }
    }
    @-webkit-keyframes danmaku {
      from {
        -webkit-transform: translateX(100%);
      }
    }
  }
}
</style>
