<template>
  <div ref="container" class="vue-danmaku">
    <div :class="['danmus', { show: !hidden }, { paused: paused }]" ref="dmContainer"></div>
    <slot />
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  model: {
    prop: 'danmus',
    event: 'input',
  },
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
    useSlot: {
      type: Boolean,
      default: false,
    },
    // 弹幕刷新频率(ms)
    debounce: {
      type: Number,
      default: 100,
    },
    // 弹幕速度
    speeds: {
      type: Number,
      default: 200,
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
    // 是否开启悬浮暂停
    isSuspend: {
      type: Boolean,
      default: false,
    },
    // 弹幕样式
    extraStyle: {
      type: String,
      default: '',
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
      calcChannels: 0,
      danmuHeight: 0, // 弹幕元素高度
      danmuList: [],
      timer: null,
      index: 0,
      hidden: false,
      paused: false,
      danChannel: {},
    }
  },
  computed: {
    danmu() {
      return {
        height: this.danmuHeight,
        fontSize: this.fontSize,
        speeds: this.speeds,
        top: this.top,
        right: this.right,
      }
    },
    danmaku() {
      return {
        channels: this.channels || this.calcChannels,
        autoplay: this.autoplay,
        loop: this.loop,
        useSlot: this.useSlot,
        debounce: this.debounce,
        randomChannel: this.randomChannel,
      }
    },
    dataWatcher() {
      return JSON.parse(JSON.stringify(this.danmuList))
    },
  },
  watch: {
    danmus: {
      handler(val) {
        this.danmuList = [...val]
      },
      deep: true,
      immediate: true,
    },
    dataWatcher: {
      handler(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    init() {
      this.initCore()
      this.initDanmuList()
      this.isSuspend && this.initSuspendEvents()
      if (this.danmaku.autoplay) {
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
    initDanmuList() {
      this.danmuList = [...this.danmus]
    },
    play() {
      this.paused = false
      if (!this.timer) {
        this.timer = setInterval(() => this.draw(), this.danmaku.debounce)
      }
    },
    draw() {
      if (!this.paused && this.danmuList.length) {
        if (this.index > this.danmuList.length - 1) {
          const screenDanmus = this.$refs.dmContainer.children.length

          if (this.danmaku.loop && screenDanmus < this.index) {
            // 一轮弹幕插入完毕
            this.$emit('list-end')

            this.index = 0
            this.insert()
          }
        } else {
          this.insert()
        }
      }
    },
    /**
     * insert也暴露到外部，允许外部直接执行绘制弹幕方法
     * @param {Object} dm 外部定义的弹幕
     */
    insert(dm) {
      const index = this.danmaku.loop ? this.index % this.danmuList.length : this.index
      const danmu = dm || this.danmuList[index]
      let el = document.createElement(`div`)
      if (this.danmaku.useSlot) {
        el = this.getSlotComponent(danmu, index).$el
      } else {
        el.innerHTML = danmu
        el.setAttribute('style', this.extraStyle)
        el.style.fontSize = `${this.danmu.fontSize}px`
        el.style.lineHeight = `${this.danmu.fontSize}px`
      }
      el.classList.add('dm')
      this.$dmContainer.appendChild(el)
      el.style.opacity = 0
      this.$nextTick(() => {
        if (!this.danmu.height) {
          this.danmuHeight = el.offsetHeight
        }
        // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
        if (!this.channels) {
          this.calcChannels = Math.floor(this.container.height / (this.danmu.height + this.danmu.top))
        }
        let channelIndex = this.getChannelIndex(el)
        if (channelIndex >= 0) {
          const width = el.offsetWidth
          const height = this.danmu.height
          el.classList.add('move')
          el.style.opacity = 1
          // 匀速
          // const speeds = (this.container.width + width) / this.danmu.speeds
          const speeds = this.container.width / this.danmu.speeds
          el.style.animationDuration = `${speeds}s`
          el.style.top = channelIndex * (height + this.danmu.top) + 'px'
          el.style.width = width + this.danmu.right + 'px'
          el.style.setProperty('--dm-left-offset', `-${this.container.width}px`)
          el.dataset.index = this.index
          el.addEventListener('animationend', () => {
            if (+el.dataset.index === this.danmuList.length - 1 && !this.danmaku.loop) {
              this.$emit('play-end', el.dataset.index)
            }
            this.$dmContainer.removeChild(el)
          })
          this.index++
        } else {
          this.$dmContainer.removeChild(el)
        }
      })
    },
    getSlotComponent(danmu, index) {
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
        propsData: { danmu, index },
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
    // 弹幕悬浮事件
    initSuspendEvents() {
      let suspendDanmus = []
      this.$refs.dmContainer.addEventListener('mousemove', (e) => {
        let target = e.target

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || e.target
        }

        if (!target.className.includes('dm')) return

        target.classList.add('pause')
        suspendDanmus.push(target)
      })
      this.$refs.dmContainer.addEventListener('mouseout', (e) => {
        let target = e.target

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || e.target
        }

        if (!target.className.includes('dm')) return
        target.classList.remove('pause')

        suspendDanmus.forEach((item) => {
          item.classList.remove('pause')
        })
        suspendDanmus = []
      })
    },
    clear() {
      this.clearTimer()
      this.index = 0
    },
    reset() {
      this.$container = null
      this.$dmContainer = null
      this.danmuHeight = 0
      this.init()
    },
    stop() {
      this.danChannel = {}
      this.$dmContainer.innerHTML = ''
      this.paused = true
      this.hidden = false
      this.clear()
      this.initDanmuList()
    },
    pause() {
      this.paused = true
    },
    // 添加弹幕（插入到当前播放的弹幕位置）
    add(danmu) {
      if (this.index === this.danmuList.length) {
        // 如果当前弹幕已经播放完了，那么仍然走 push
        this.danmuList.push(danmu)

        return this.danmuList.length - 1
      } else {
        const index = this.index % this.danmuList.length
        this.danmuList.splice(index, 0, danmu)

        return index + 1
      }
    },
    // 添加弹幕（插入到弹幕末尾）
    push(danmu) {
      this.danmuList.push(danmu)

      return this.danmuList.length - 1
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
        items[i].style.setProperty('--dm-left-offset', `-${this.container.width}px`)
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
      color: #ddd;
      white-space: pre;
      transform: translateX(100%);
      transform-style: preserve-3d;
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
      to {
        transform: translateX(var(--dm-left-offset));
      }
    }
    @-webkit-keyframes moveLeft {
      from {
        -webkit-transform: translateX(100%);
      }
      to {
        -webkit-transform: translateX(var(--dm-left-offset));
      }
    }
  }
}
</style>
