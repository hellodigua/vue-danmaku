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
  reactive,
  computed,
  h,
} from 'vue'
import { DanChannel, DanmuItem, DanmakuItem } from './typings/Danmaku'
import { useModelWrapper } from './utils'

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
  name: 'vue3-danmaku',
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
  emits: ['list-end', 'play-end', 'dm-over', 'dm-out', 'update:danmus'],
  setup(props, { emit, slots }) {
    // 容器
    let container = ref<HTMLDivElement>(document.createElement('div'))
    let dmContainer = ref<HTMLDivElement>(document.createElement('div'))
    const containerWidth = ref(0)
    const containerHeight = ref(0)
    // 变量
    let timer: number = 0
    const calcChannels = ref(0)
    const danmuHeight = ref(0)
    const index = ref<number>(0)
    const hidden = ref(false)
    const paused = ref(false)
    const danChannel = ref<DanChannel>({})

    const danmuList = useModelWrapper<Danmu[]>(props, emit, 'danmus')

    const danmaku: DanmakuItem = reactive({
      channels: computed(() => props.channels || calcChannels.value),
      autoplay: computed(() => props.autoplay),
      loop: computed(() => props.loop),
      useSlot: computed(() => props.useSlot),
      debounce: computed(() => props.debounce),
      randomChannel: computed(() => props.randomChannel),
    })

    const danmu: DanmuItem = reactive({
      height: computed(() => danmuHeight.value),
      fontSize: computed(() => props.fontSize),
      speeds: computed(() => props.speeds),
      top: computed(() => props.top),
      right: computed(() => props.right),
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      clear()
    })

    function init() {
      initCore()
      props.isSuspend && initSuspendEvents()
      if (danmaku.autoplay) {
        play()
      }
    }

    function initCore() {
      containerWidth.value = container.value.offsetWidth
      containerHeight.value = container.value.offsetHeight
      if (containerWidth.value === 0 || containerHeight.value === 0) {
        throw new Error('获取不到容器宽高')
      }
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

          if (danmaku.loop) {
            if (screenDanmus < index.value) {
              // 一轮弹幕插入完毕
              emit('list-end')
              index.value = 0
            }
            insert()
          }
        } else {
          insert()
        }
      }
    }

    /**
     * 插入弹幕（也暴露到外部，允许外部直接执行绘制弹幕方法）
     * @param {Object} dm 外部定义的弹幕
     */
    function insert(dm?: any) {
      const _index = danmaku.loop ? index.value % danmuList.value.length : index.value
      const _danmu = dm || danmuList.value[_index]
      let el = document.createElement(`div`)

      if (danmaku.useSlot) {
        el = getSlotComponent(_danmu, _index).$el
      } else {
        el.innerHTML = _danmu as string
        el.setAttribute('style', props.extraStyle)
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
          el.dataset.index = `${_index}`
          el.style.opacity = '1'
          el.style.top = channelIndex * (height + danmu.top) + 'px'
          el.style.width = width + danmu.right + 'px'
          el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + width}px`)
          el.style.left = `${containerWidth.value}px`
          el.style.animationDuration = `${containerWidth.value / danmu.speeds}s`
          el.addEventListener('animationend', () => {
            if (Number(el.dataset.index) === danmuList.value.length - 1 && !danmaku.loop) {
              emit('play-end', el.dataset.index)
            }
            dmContainer.value && dmContainer.value.removeChild(el)
          })
          index.value++
        } else {
          dmContainer.value.removeChild(el)
        }
      })
    }

    function getSlotComponent(_danmu: any, _index: number) {
      const DmComponent = createApp({
        render() {
          return h('div', {}, [
            slots.dm &&
              slots.dm({
                danmu: _danmu,
                index: _index,
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
      dmContainer.value.addEventListener('mouseover', (e) => {
        let target = e.target as EventTarget & HTMLElement

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || target
        }

        if (!target.className.includes('dm')) return

        if (suspendDanmus.includes(target)) return

        emit('dm-over', { el: target })
        target.classList.add('pause')

        suspendDanmus.push(target)
      })
      dmContainer.value.addEventListener('mouseout', (e) => {
        let target = e.target as EventTarget & HTMLElement

        if (!target.className.includes('dm')) {
          target = target.closest('.dm') || target
        }

        if (!target.className.includes('dm')) return
        emit('dm-out', { el: target })
        target.classList.remove('pause')

        // 容错处理
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
        danmuList.value.push(danmu)

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

        el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + el.offsetWidth}px`)
        el.style.left = `${containerWidth.value}px`
        el.style.animationDuration = `${containerWidth.value / danmu.speeds}s`
      }
    }

    return {
      // element
      container,
      dmContainer,

      // variable
      hidden,
      paused,
      danmuList,

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
      insert,
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
      font-size: 20px;
      color: #ddd;
      white-space: pre;
      transform: translateX(0);
      transform-style: preserve-3d;
      &.move {
        will-change: transform;
        animation-name: moveLeft;
        animation-timing-function: linear;
        animation-play-state: running;
      }
      &.pause {
        animation-play-state: paused;
        z-index: 100;
      }
    }
    @keyframes moveLeft {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(var(--dm-scroll-width));
      }
    }
    @-webkit-keyframes moveLeft {
      from {
        -webkit-transform: translateX(0);
      }
      to {
        -webkit-transform: translateX(var(--dm-scroll-width));
      }
    }
  }
}
</style>
