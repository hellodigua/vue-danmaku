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
        return {
          channels: 0,
          loop: false
        }
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
        danmus: []
      },
      index: 0,
      speed: 5,
      continue: true,
      danChannel: {},
      channels: 0, // 轨道数量
      height: 30 // 弹幕高度
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      this.$danmaku = this.$refs.danmaku
      this.$danmus = this.$refs.danmus
      this.channels = this.config.channels || parseInt(this.$danmaku.offsetHeight / this.height) // 初始化轨道数量
    },
    onMouseenter () {
      if (this.hover && !this.timer) {
        this.draw()
      }
    },
    onMouseleave () {
      if (this.hover) {
        this.stop()
      }
    },
    draw () {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (this.index > this.danmus.length - 1) {
            if (this.config.loop) {
              this.insert()
            } else {
              this.index = 0
              clearInterval(this.timer)
            }
          } else {
            this.insert()
          }
        }, 50)
      })
    },
    insert () {
      const index = this.config.loop ? this.index % this.danmus.length : this.index
      const el = document.createElement(`p`)
      el.classList.add(`dm`)
      if (this.continue) {
        el.innerHTML = this.danmus[index]
        el.setAttribute('index', this.index)
        // this.danmaku.danmus.push({
        //   index: this.index,
        //   danmu: this.danmus[index]
        // })
        this.$danmus.appendChild(el)
      }
      this.$nextTick(() => {
        const tunnelIndex = this.getChannel(el)
        if (tunnelIndex >= 0) {
          this.continue = true
          const width = el.offsetWidth
          el.style.top = tunnelIndex * this.height + 'px'
          el.style.left = -width - 1 + 'px'
          el.style.transition = 'left ' + this.speed + 's linear'
          this.index++
          // this.clean()
        } else {
          this.continue = false
        }
      })
    },
    clean () {
      const index = this.danmaku.danmus[0].index
      const el = this.danmaku.$refs['dm-' + index]
      if (el && (el.getBoundingClientRect().right < this.$danmaku.getBoundingClientRect().left)) {
        // this.danmaku.danmus.splice(0, 1)
      }
    },
    getChannel (el) {
      const tmp = this.$danmaku.offsetWidth / ((this.$danmaku.offsetWidth + el.offsetWidth) / this.speed)
      for (let i = 0; i < this.channels; i++) {
        const items = this.danChannel[i + '']
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            if (danRight <= this.$danmaku.offsetWidth - tmp * ((this.$danmaku.offsetWidth + parseInt(items[j].offsetWidth)) / this.speed) || danRight <= 0) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i + ''].push(el)
              el.addEventListener('animationend', () => {
                this.danChannel[i + ''].splice(0, 1)
              })
              return i % this.channels
            }
          }
        } else {
          this.danChannel[i + ''] = [el]
          return i % this.channels
        }
      }
      return -1
    },
    // 弹幕到右侧的距离
    getDanRight (el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.$danmaku.getBoundingClientRect().right + eleWidth
      return this.$danmaku.getBoundingClientRect().right - eleRight
    },
    stop () {
    }
  }
}
</script>
<style lang="postcss">
.danmaku {
  position: relative;
  overflow: hidden;
}
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
  }
}
.dm {
    position: absolute;
    color: #fff;
    font-size: 18px;
    left: 100%;
    top: 8px;
    white-space: pre;
    text-shadow: 1px 1px 2px #001;
  }
</style>
