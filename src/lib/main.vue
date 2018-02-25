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
      speed: 5
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
            let isP = this.collision()
            if (isP) {
              this.add()
            }
          }
        }, 1000 * 1.5)
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
        console.log(el)
        let width = el.offsetWidth
        // console.log(el.offsetHeight)
        el.style.left = -width + 'px'
        el.style.transition = 'left ' + this.speed + 's linear'
        this.index++
      })
    },
    collision () {
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
