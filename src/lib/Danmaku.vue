<template>
  <div ref="container" class="vue-danmaku">
    <div ref="dmContainer" :class="['danmus', { show: !hidden }, { paused: paused }]"></div>
    <slot />
  </div>
</template>
<script lang="ts">
import {
  createApp,
  defineComponent,
  nextTick,
  onMounted,
  onBeforeUnmount,
  PropType,
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  h,
} from 'vue'
import { DanChannel, DanmuItem, DanmakuItem } from './typings/Danmaku'

/**
 * 自定义弹幕
 */
type CustomDanmu = {
  [key: string]: any
}

/**
 * 弹幕类型
 */
type Danmu = string | CustomDanmu

export default defineComponent({
  components: {},
  props: {
    /**
     * 弹幕列表数据
     */
    danmus: {
      type: Array as PropType<Danmu[]>,
      required: true,
      default: () => [],
    },
    /**
     * 轨道数量，0为最大轨道数量（撑满容器）
     */
    channels: {
      type: Number,
      default: 0,
    },
    /**
     * 是否自动播放
     */
    autoplay: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否循环播放
     */
    loop: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启弹幕插槽，默认否
     */
    useSlot: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹幕刷新频率(ms)
     */
    debounce: {
      type: Number,
      default: 100,
    },
    /**
     * 弹幕速度（像素/秒）
     */
    speeds: {
      type: Number,
      default: 200,
    },
    /**
     * 是否开启随机轨道注入弹幕
     */
    randomChannel: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹幕字号（仅文本模式）
     */
    fontSize: {
      type: Number,
      default: 18,
    },
    /**
     * 弹幕垂直间距
     */
    top: {
      type: Number,
      default: 4,
    },
    /**
     * 弹幕水平间距
     */
    right: {
      type: Number,
      default: 0,
    },
    /**
     * 是否开启悬浮暂停
     */
    isSuspend: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹幕额外样式
     */
    extraStyle: {
      type: String,
      default: '',
    },
  },
  emits: ['list-end', 'play-end'],
  setup(props, { emit, slots }) {
    const {
      danmus,
      channels,
      autoplay,
      loop,
      useSlot,
      debounce,
      randomChannel,
      speeds,
      fontSize,
      top,
      right,
      isSuspend,
      extraStyle,
    } = toRefs(props)

    // 容器
    let container = ref<HTMLDivElement>(document.createElement('div'))
    let dmContainer = ref<HTMLDivElement>(document.createElement('div'))
    const containerWidth = ref(0)
    const containerHeight = ref(0)
    // 变量
    let timer: number = 0
    const calcChannels = ref(0)
    const danmuHeight = ref(0)
    const danmuList = ref<Danmu[]>([])
    const index = ref<number>(0)
    const hidden = ref(false)
    const paused = ref(false)
    const danChannel = ref<DanChannel>({})

    const danmaku: DanmakuItem = reactive({
      channels: computed(() => channels.value || calcChannels.value),
      autoplay: computed(() => autoplay.value),
      loop: computed(() => loop.value),
      useSlot: computed(() => useSlot.value),
      debounce: computed(() => debounce.value),
      randomChannel: computed(() => randomChannel.value),
    })

    const danmu: DanmuItem = reactive({
      height: computed(() => danmuHeight.value),
      fontSize: computed(() => fontSize.value),
      speeds: computed(() => speeds.value),
      top: computed(() => top.value),
      right: computed(() => right.value),
    })

    watch(
      () => props.danmus,
      () => initDanmuList()
    )

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      clear()
    })

    function init() {
      initCore()
      initDanmuList()
      isSuspend.value && initSuspendEvents()
      if (danmaku.autoplay) {
        play()
      }
    }

    function initCore() {
      containerWidth.value = container.value.offsetWidth
      containerHeight.value = container.value.offsetHeight
    }

    function initDanmuList() {
      danmuList.value = [...danmus.value]
    }

    function play() {
      paused.value = false
      if (!timer) {
        timer = setInterval(() => draw(), danmaku.debounce)
      }
    }

    /**
     * 绘制弹幕
     */
    function draw() {
      if (!paused.value && danmuList.value.length) {
        if (index.value > danmuList.value.length - 1) {
          const screenDanmus = dmContainer.value.children.length

          if (danmaku.loop && screenDanmus < index.value) {
            // 一轮弹幕插入完毕
            emit('list-end')

            index.value = 0
            insert()
          }
        } else {
          insert()
        }
      }
    }

    /**
     * 插入弹幕
     */
    function insert() {
      const _index = loop.value ? index.value % danmuList.value.length : index.value
      let el = document.createElement(`div`)

      if (danmaku.useSlot) {
        el = getSlotComponent(_index).$el
      } else {
        el.innerHTML = danmuList.value[_index] as string
        el.setAttribute('style', extraStyle.value)
        el.style.fontSize = `${danmu.fontSize}px`
        el.style.lineHeight = `${danmu.fontSize}px`
      }
      el.classList.add('dm')
      dmContainer.value.appendChild(el)
      el.style.opacity = '0'
      nextTick(() => {
        if (!danmu.height) {
          danmuHeight.value = el.offsetHeight
        }
        // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
        if (!danmaku.channels) {
          calcChannels.value = Math.floor(containerHeight.value / (danmu.height + danmu.top))
        }
        let channelIndex = getChannelIndex(el)
        if (channelIndex >= 0) {
          const width = el.offsetWidth
          const height = danmu.height
          el.classList.add('move')
          el.style.opacity = '1'

          const speeds = containerWidth.value / danmu.speeds
          el.style.animationDuration = `${speeds}s`
          el.style.top = channelIndex * (height + danmu.top) + 'px'
          el.style.width = width + danmu.right + 'px'
          el.style.setProperty('--dm-left-offset', `-${containerWidth.value}px`)
          el.dataset.index = `${_index}`
          el.addEventListener('animationend', () => {
            if (Number(el.dataset.index) === danmuList.value.length - 1 && !danmaku.loop) {
              emit('play-end', el.dataset.index)
            }
            dmContainer.value.removeChild(el)
          })
          if (el.classList.length > 0) {
            index.value++
          }
        } else {
          if (el.classList.length > 0) {
            dmContainer.value.removeChild(el)
          }
        }
      })
    }

    function getSlotComponent(index: number) {
      const DmComponent = createApp({
        render() {
          return h('div', {}, [
            slots.dm &&
              slots.dm({
                danmu: danmuList.value[index],
                index,
              }),
          ])
        },
      })

      const ele = DmComponent.mount(document.createElement('div'))

      return ele
    }

    function getChannelIndex(el: HTMLDivElement): number {
      let _channels = [...Array(danmaku.channels).keys()]

      if (danmaku.randomChannel) {
        _channels = _channels.sort(() => 0.5 - Math.random())
      }
      for (let i of _channels) {
        const items = danChannel.value[i]

        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = getDanRight(items[j]) - 10
            // 安全距离判断
            if (danRight <= (el.offsetWidth - items[j].offsetWidth) * 0.88 || danRight <= 0) {
              break
            }
            if (j === items.length - 1) {
              danChannel.value[i].push(el)
              el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1))
              return i % danmaku.channels
            }
          }
        } else {
          danChannel.value[i] = [el]
          el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1))
          return i % danmaku.channels
        }
      }
      return -1
    }

    /**
     * 获取弹幕右侧到屏幕右侧的距离
     */
    function getDanRight(el: HTMLDivElement) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || dmContainer.value.getBoundingClientRect().right + eleWidth
      return dmContainer.value.getBoundingClientRect().right - eleRight
    }

    function clearTimer() {
      clearInterval(timer)
      timer = 0
    }

    function initSuspendEvents() {
      let suspendDanmus: HTMLElement[] = []
      dmContainer.value.addEventListener('mousemove', (e) => {
        let target = e.target as EventTarget & HTMLElement

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || target
        }

        if (!target.className.includes('dm')) return

        target.classList.add('pause')
        suspendDanmus.push(target)
      })
      dmContainer.value.addEventListener('mouseout', (e) => {
        let target = e.target as EventTarget & HTMLElement

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || target
        }

        if (!target.className.includes('dm')) return
        target.classList.remove('pause')

        suspendDanmus.forEach((item) => {
          item.classList.remove('pause')
        })
        suspendDanmus = []
      })
    }

    /**
     * 清空弹幕
     */
    function clear() {
      clearTimer()
      index.value = 0
    }

    /**
     * 重置弹幕
     */
    function reset() {
      danmuHeight.value = 0
      init()
    }

    /**
     * 停止弹幕
     */
    function stop() {
      danChannel.value = {}
      dmContainer.value.innerHTML = ''
      paused.value = true
      hidden.value = false
      clear()
      initDanmuList()
    }

    /**
     * 暂停弹幕
     */
    function pause(): void {
      paused.value = true
    }

    /**
     * 添加弹幕（插入到当前播放的弹幕位置）
     */
    function add(danmu: Danmu): number {
      if (index.value === danmuList.value.length) {
        // 如果当前弹幕已经播放完了，那么仍然走 push
        push(danmu)

        return danmuList.value.length - 1
      } else {
        const _index = index.value % danmuList.value.length
        danmuList.value.splice(_index, 0, danmu)

        return _index + 1
      }
    }

    /**
     * 添加弹幕（插入到弹幕末尾）
     */
    function push(danmu: Danmu): number {
      danmuList.value.push(danmu)

      return danmuList.value.length - 1
    }

    /**
     * 获取播放状态
     */
    function getPlayState(): boolean {
      return !paused.value
    }

    /**
     * 显示弹幕
     */
    function show(): void {
      hidden.value = false
    }

    /**
     * 隐藏弹幕
     */
    function hide(): void {
      hidden.value = true
    }

    function resize() {
      initCore()
      const items = dmContainer.value.getElementsByClassName('dm')

      for (let i = 0; i < items.length; i++) {
        const el = items[i] as HTMLDivElement
        el.style.setProperty('--dm-left-offset', `-${containerWidth}px`)
      }
    }

    return {
      // element
      container,
      dmContainer,

      // variable
      hidden,
      paused,

      // function
      getPlayState,
      resize,
      play,
      pause,
      stop,
      show,
      hide,
      reset,
      add,
      push,
    }
  },
})
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
