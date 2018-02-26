<template>
  <div ref="container" class="danmaku" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
    <div class="danmus"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import Danmu from './danmu.vue'
export default {
  props: {
    danmus: {
      type: Array,
      required: true
    },
    row: {
      type: Number,
      default: 3
    },
    config: {
      type: Object,
      default: () => {
        return {
          channels: 0
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
      danmaku: null,
      index: 0,
      speed: 5,
      continueG: true,
      danChannel: {},
      channels: 1, // 轨道数量
      height: 30 // 弹幕高度
    }
  },
  computed: {},
  watch: {
    isActive (val) {
      val ? this.draw() : this.stop()
    }
  },
  created () { },
  mounted () {
    this.initDanmu()
  },
  methods: {
    initDanmu () {
      this.danmaku = new Vue(Danmu).$mount('.danmus')
      this.danmaku.danmus = []
      this.container = this.$refs.container
      this.channels = this.config.channels || parseInt(this.container.offsetHeight / this.height) // 初始化轨道数量
    },
    onMouseenter () {
      if (this.hover) {
        this.isActive = true
      }
    },
    onMouseleave () {
      if (this.hover) {
        this.isActive = false
      }
    },
    draw () {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          if (this.index > this.danmus.length - 1) {
            clearInterval(this.timer)
          } else {
            this.add()
          }
        }, 100)
      })
    },
    add () {
      if (this.continueG) {
        this.danmaku.danmus.push(this.danmus[this.index])
      }
      this.$nextTick(() => {
        const el = this.danmaku.$refs['dm-' + this.index]
        const tunnelIndex = this.getChannel(el)
        console.log(el)
        if (tunnelIndex >= 0) {
          this.continueG = true
          const width = el.offsetWidth
          // console.log(el.offsetHeight)
          el.style.top = tunnelIndex * this.height + 'px'
          el.style.left = -width + 'px'
          el.style.transition = 'left ' + this.speed + 's linear'
          this.index++
        } else {
          this.continueG = false
        }
      })
    },
    getChannel (el) {
      console.log(el.style)
      for (let i = 0; i < this.channels; i++) {
        const items = this.danChannel[i + '']
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            // TODO：碰撞检测
            if (danRight <= 0) {
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
    getDanRight (el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.container.getBoundingClientRect().right + eleWidth
      return this.container.getBoundingClientRect().right - eleRight
    },
    stop () {
    }
  }
}
</script>
<style lang="postcss" scoped>
.danmaku {
  position: relative;
  overflow: hidden;
}
</style>
