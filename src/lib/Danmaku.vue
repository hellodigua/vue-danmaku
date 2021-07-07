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
  watch,
  h,
} from 'vue'
import { DanChannel, DanmuItem, DanmakuItem } from './Danmaku'

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
    // 弹幕列表数据
    danmus: {
      type: Array as PropType<Danmu[]>,
      required: true,
      default: () => [],
    },
    // 轨道数量，0为最大轨道数量（撑满容器）
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
      default: 400,
    },
    // 是否开启随机轨道注入弹幕
    randomChannel: {
      type: Boolean,
      default: false,
    },
    // 弹幕速度（每屏滚过的时间）
    speed: {
      type: Number,
      default: 10,
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
    // 弹幕水平间距（默认会留一定安全距离）
    right: {
      type: Number,
      default: 0,
    },
    // 弹幕样式
    extraStyle: {
      type: String,
      default: '',
    },
  },
  emits: ['done'],
  setup(props, { emit, slots }) {
    const {
      danmus,
      channels,
      autoplay,
      loop,
      useSlot,
      debounce,
      randomChannel,
      speed,
      fontSize,
      top,
      right,
      extraStyle,
    } = toRefs(props)

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      clear()
    })

    // 容器
    let container = ref<HTMLDivElement>(document.createElement('div'))
    let dmContainer = ref<HTMLDivElement>(document.createElement('div'))
    const danmakuWidth = ref(0)
    const danmakuHeight = ref(0)
    // 变量
    let timer: number = 0
    const danmuList = ref<Danmu[]>([])
    const paused = ref(false)
    const index = ref<number>(0)
    const hidden = ref(false)
    const danChannel = ref<DanChannel>({})

    const danmaku: DanmakuItem = reactive({
      channels: 0, // 轨道数量
      autoplay: true, // 自动播放
      loop: false, // 是否循环
      useSlot: false, // 是否开启slot
      debounce: 100, // 弹幕刷新频率(ms)
      randomChannel: false, // 随机选择轨道插入
    })

    const danmu: DanmuItem = reactive({
      height: 0, // 弹幕元素高度
      fontSize: 18, // 弹幕元素字号（slot下不可用）
      speed: 10, // 弹幕速度
      top: 4, // 弹幕垂直间距
      right: 0, // 弹幕水平间距
    })

    watch(
      () => props.danmus,
      (val) => (danmuList.value = [...val])
    )

    function init() {
      initCore()
      initConfig()
      if (danmaku.autoplay) {
        play()
      }
    }

    function initCore() {
      danmakuWidth.value = container.value.offsetWidth
      danmakuHeight.value = container.value.offsetHeight
    }

    function initConfig() {
      danmus.value.forEach((item: Danmu) => {
        danmuList.value.push(item)
      })

      danmaku.channels = channels.value
      danmaku.autoplay = autoplay.value
      danmaku.loop = loop.value
      danmaku.useSlot = useSlot.value
      danmaku.debounce = debounce.value
      danmaku.randomChannel = randomChannel.value

      danmu.fontSize = fontSize.value
      danmu.speed = speed.value
      danmu.top = top.value
      danmu.right = right.value
    }

    function play() {
      paused.value = false
      if (!timer) {
        draw()
      }
    }

    /**
     * 绘制弹幕
     */
    function draw() {
      nextTick(() => {
        timer = setInterval(() => {
          if (!paused.value && danmuList.value.length) {
            if (index.value > danmuList.value.length - 1) {
              if (danmaku.loop) {
                index.value = 0
                insert()
              }
              // 播放完成
              emit('done')
            } else {
              insert()
            }
          }
        }, debounce.value)
      })
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

      nextTick(() => {
        if (!danmu.height || !danmaku.channels) {
          danmu.height = el.offsetHeight
          // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
          if (!danmaku.channels) {
            danmaku.channels = Math.floor(danmakuHeight.value / (danmu.height + danmu.top))
          }
        }
        let channelIndex = getChannelIndex(el)
        if (channelIndex >= 0) {
          const width = el.offsetWidth
          const height = danmu.height
          el.classList.add('move')
          el.style.animationDuration = `${danmu.speed}s`
          el.style.top = channelIndex * (height + danmu.top) + 'px'
          el.style.width = width + danmu.right + 'px'
          // @ts-ignore: HTML Element不一定有width属性
          el.style.setProperty('--dm-left-offset', `-${danmakuWidth.value}px`)
          el.dataset.index = `${_index}`
          el.addEventListener('animationend', () => {
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

    function getSlotComponent(index: number) {
      const DmComponent = createApp({
        render() {
          return h('div', {}, [
            // @ts-ignore 我也不懂tslint报错的原因，以后再修吧
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
      danmu.height = 0
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
      initConfig()
    }

    /**
     * 暂停弹幕
     */
    function pause(): void {
      paused.value = true
    }
    function addDanmu(danmu: Danmu, config: any) {}

    /**
     * 添加弹幕（插入到当前播放的弹幕位置）
     */
    function add(danmu: Danmu): void {
      const _index = index.value % danmuList.value.length
      danmuList.value.splice(_index, 0, danmu)
    }

    /**
     * 添加弹幕（插入到弹幕末尾）
     */
    function push(danmu: Danmu): void {
      danmuList.value.push(danmu)
    }

    /**
     * 设置轨道
     */
    function setChannels(channels: number): void {
      danmaku.channels = channels
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
        // items.[i].style.setProperty('--dm-left-offset', `-${container.value.offsetWidth}px`)
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
      setChannels,
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
      color: #fff;
      white-space: pre;
      transform: translateX(100%);
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
