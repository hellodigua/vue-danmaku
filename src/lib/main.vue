<template>
  <div ref="danmaku" class="danmaku" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
    <div class="danmus show" ref="danmus"></div>
  </div>
</template>
<script>
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
    },
    hover: {
      type: Boolean,
      default: true
    }
  },
  data () {
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
        loop: false // 是否循环
      },
      danmu: {
        height: 30
      },
      index: 0,
      speed: 5,
      continue: true,
      danChannel: {}
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
      this.$emit('inited')
    })
  },
  methods: {
    init () {
      this.initCore()
      this.initConfig()
    },
    initCore () {
      this.$danmaku = this.$refs.danmaku
      this.$danmus = this.$refs.danmus
    },
    initConfig () {
      this.danmaku.width = this.$danmus.offsetWidth
      this.danmaku.height = this.$danmus.offsetHeight
      this.danmaku.danmus = this.danmus
      this.danmaku.channels = this.config.channels || parseInt(this.danmaku.offsetHeight / this.danmu.height)
      this.danmaku.loop = this.config.loop || this.danmaku.loop
    },
    onMouseenter () {
      this.$emit('mousein')
    },
    onMouseleave () {
      this.$emit('mouseout')
    },
    draw () {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (this.index > this.danmus.length - 1) {
            this.config.loop ? this.insert() : this.clear()
          } else {
            this.insert()
          }
        }, 50)
      })
    },
    insert () {
      const index = this.config.loop ? this.index % this.danmus.length : this.index
      const el = document.createElement(`p`)
      if (this.continue) {
        el.classList.add(`dm`)
        el.innerHTML = this.danmus[index]
        el.setAttribute('index', this.index)
        this.$danmus.appendChild(el)
      }
      this.$nextTick(() => {
        let channelIndex = this.getChannel(el)
        if (channelIndex >= 0) {
          this.continue = true
          const width = el.offsetWidth
          el.style.top = channelIndex * this.danmu.height + 'px'
          el.style.left = -width - 1 + 'px'
          el.style.transition = 'left ' + this.speed + 's linear'
          el.addEventListener('transitionend', () => {
            this.$danmus.removeChild(el)
          })
          if (el.classList.length > 0) {
            this.index++
          }
        } else {
          if (el.classList.length > 0) {
            this.$danmus.removeChild(el)
          }
          this.continue = false
        }
      })
    },
    getChannel (el) {
      const tmp = this.$danmus.offsetWidth / ((this.$danmus.offsetWidth + el.offsetWidth) / this.speed)
      for (let i = 0; i < this.danmaku.channels; i++) {
        const items = this.danChannel[i + '']
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            if (danRight <= this.$danmus.offsetWidth - tmp * ((this.$danmus.offsetWidth + parseInt(items[j].offsetWidth)) / this.speed) || danRight <= 0) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i + ''].push(el)
              el.addEventListener('transitionend', () => {
                this.danChannel[i + ''].splice(0, 1)
              })
              return i % this.danmaku.channels
            }
          }
        } else {
          this.danChannel[i + ''] = [el]
          el.addEventListener('transitionend', () => {
            this.danChannel[i + ''].splice(0, 1)
          })
          return i % this.danmaku.channels
        }
      }
      return -1
    },
    // 弹幕到右侧的距离
    getDanRight (el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.$danmus.getBoundingClientRect().right + eleWidth
      return this.$danmus.getBoundingClientRect().right - eleRight
    },
    stop () {
      this.danChannel = {}
      this.$refs.danmus.innerHTML = ''
      this.clear()
    },
    clear () {
      this.index = 0
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="postcss">
.danmaku {
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
    -o-transition: all 0.3s;
    transition: all 0.3s;
    &.show {
      opacity: 1;
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
      left: 100%;
      top: 8px;
      white-space: pre;
      text-shadow: 1px 1px 2px #001;
      will-change: transform;
    }
  }
}
</style>
