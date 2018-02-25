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
      this.channels = parseInt(this.container.offsetHeight / this.height) // 初始化轨道数量
      // console.log(this.container.offsetWidth)
      // console.log(this.container.offsetHeight)
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
        }, 1000)
        for (let item in this.danmaku.$refs) {
          console.log(this.danmaku.$refs[item].offsetWidth)
        }
      })
    },
    add () {
      this.danmaku.danmus.push(this.danmus[this.index])
      this.$nextTick(() => {
        console.log(this.danmaku.$refs)
        console.log(this.index)
        let el = this.danmaku.$refs['dm-' + this.index]
        let tunnelIndex = this.getChannel(el)
        console.log(el)
        let width = el.offsetWidth
        // console.log(el.offsetHeight)
        el.style.top = tunnelIndex * this.height + 'px'
        el.style.left = -width + 'px'
        el.style.transition = 'left ' + this.speed + 's linear'
        this.index++
      })
    },
    getChannel (el) {
      for (let i = 0; i < this.channels; i++) {
        const items = this.danChannel[i + '']
        console.log(items)
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            // TODO：碰撞检测
            if (j === 0) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i + ''].push(el)
              el.addEventListener('animationend', () => {
                this.danTunnel[i + ''].splice(0, 1)
              })
            }
          }
        } else {
          console.log(this.danChannel)
          this.danChannel[i + ''] = [el]
          return i
        }
      }
      return 1
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
