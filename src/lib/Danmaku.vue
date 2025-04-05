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
  watch,
} from 'vue'
import { DanChannel, DanmuItem, DanmakuItem } from './typings/Danmaku'
import * as rafAnimation from './animation/rafAnimation'

/**
 * 自定义弹幕
 */
type CustomDanmu<T = any> = {
  [key: string]: T
}

/**
 * 弹幕类型
 */
type Danmu = string | CustomDanmu

export default defineComponent({
  name: 'vue-danmaku',
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
     * 性能模式，启用时使用requestAnimationFrame代替CSS动画
     */
    performanceMode: {
      type: Boolean,
      default: true,
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
    const danmuList = ref<Danmu[]>([...props.danmus])

    watch(
      () => props.danmus,
      (newValue) => {
        danmuList.value = [...newValue]
      },
      { deep: true }
    )

    watch(
      danmuList,
      (newValue) => {
        emit('update:danmus', newValue)
      },
      { deep: true }
    )

    const danmaku: DanmakuItem = reactive({
      channels: computed(() => props.channels || calcChannels.value),
      autoplay: computed(() => props.autoplay),
      loop: computed(() => props.loop),
      debounce: computed(() => props.debounce),
      randomChannel: computed(() => props.randomChannel),
    })

    const danmu: DanmuItem = reactive({
      height: computed(() => danmuHeight.value),
      speeds: computed(() => props.speeds),
      top: computed(() => props.top),
      right: computed(() => props.right),
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      stop()
      clear()
      if (dmContainer.value) {
        dmContainer.value.removeEventListener('mouseover', onMouseOver)
        dmContainer.value.removeEventListener('mouseout', onMouseOut)
      }

      // 清理所有requestAnimationFrame
      if (props.performanceMode) {
        rafAnimation.cancelAllAnimations()
      }
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
        timer = window.setInterval(() => draw(), danmaku.debounce)
      }

      // 在性能模式下，恢复所有暂停的动画
      if (props.performanceMode) {
        resumeAllAnimations()
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
     * @param {Danmu} dm 外部定义的弹幕
     */
    function insert(dm?: Danmu) {
      const _index = danmaku.loop ? index.value % danmuList.value.length : index.value
      const _danmu = dm || danmuList.value[_index]
      const el = getSlotComponent(_danmu, _index).$el
      el.classList.add('dm')
      dmContainer.value.appendChild(el)
      el.style.opacity = '0'

      // 保存组件实例的引用，以便后续清理
      el._vueInstance = {
        instance: el.__vueParentComponent || { ctx: {} },
        el: el,
      }

      nextTick(() => {
        if (!danmu.height) {
          danmuHeight.value = el.offsetHeight
        }
        // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
        if (!danmaku.channels) {
          calcChannels.value = Math.floor(containerHeight.value / (danmu.height + danmu.top))
        }
        processElement(el, _index)
      })
    }

    /**
     * 获取弹幕组件实例
     * @returns 组件挂载结果
     */
    function getSlotComponent(
      _danmu: Danmu,
      _index: number
    ): {
      $el: HTMLDivElement
      [key: string]: any
    } {
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

      // 保存对应用实例的引用以便后续清理
      ele.$el.__vueApp = DmComponent

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
              // 不在这里添加animationend事件，统一在insert函数中处理
              return i % danmaku.channels
            }
          }
        } else {
          danChannel.value[i] = [el]
          // 不在这里添加animationend事件，统一在insert函数中处理
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
      dmContainer.value.addEventListener('mouseover', onMouseOver)
      dmContainer.value.addEventListener('mouseout', onMouseOut)
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
      // 清理所有弹幕元素
      if (dmContainer.value) {
        const danmuElements = Array.from(dmContainer.value.querySelectorAll('.dm'))
        danmuElements.forEach((dm) => {
          cleanupElement(dm as HTMLDivElement)
        })

        dmContainer.value.innerHTML = ''
      }

      // 性能模式下取消所有动画帧
      if (props.performanceMode) {
        rafAnimation.cancelAllAnimations()
      }

      danChannel.value = {}
      paused.value = true
      hidden.value = false
      clear()
    }

    /**
     * 暂停弹幕
     */
    function pause(): void {
      paused.value = true

      // 在性能模式下，暂停所有动画
      if (props.performanceMode) {
        rafAnimation.pauseAllAnimations()
      }
    }

    /**
     * 恢复所有动画 - 性能模式专用
     */
    function resumeAllAnimations() {
      // 恢复所有暂停的动画
      if (dmContainer.value) {
        const danmuElements = Array.from(dmContainer.value.querySelectorAll('.dm'))
        danmuElements.forEach((dm) => {
          const el = dm as HTMLDivElement
          const width = el.offsetWidth

          // 使用新的动画模块恢复动画
          rafAnimation.resumeAnimation(
            el,
            width,
            containerWidth.value,
            danmu.speeds,
            () => paused.value,
            handleAnimationEnd
          )
        })
      }
    }

    /**
     * 处理动画结束事件
     */
    function handleAnimationEnd(el: HTMLDivElement) {
      if (Number(el.dataset.index) === danmuList.value.length - 1 && !danmaku.loop) {
        emit('play-end', el.dataset.index)
      }

      // 清理元素
      cleanupElement(el)

      if (dmContainer.value) {
        dmContainer.value.removeChild(el)
      }
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

    // 提取事件处理函数为命名函数，以便可以移除
    let suspendDanmus: HTMLElement[] = []
    function onMouseOver(e: MouseEvent) {
      let target = e.target as EventTarget & HTMLElement

      if (!target.className.includes('dm')) {
        target = target.closest('.dm') || target
      }

      if (!target.className.includes('dm')) return

      if (suspendDanmus.includes(target)) return

      emit('dm-over', { el: target })

      // 提高暂停弹幕的层级
      target.style.zIndex = '100'

      if (props.performanceMode) {
        // 性能模式下，暂停单个弹幕的动画
        rafAnimation.cancelAnimation(target)
      } else {
        // CSS动画模式下，添加暂停类
        target.classList.add('pause')
      }

      suspendDanmus.push(target)
    }

    function onMouseOut(e: MouseEvent) {
      let target = e.target as EventTarget & HTMLElement

      if (!target.className.includes('dm')) {
        target = target.closest('.dm') || target
      }

      if (!target.className.includes('dm')) return

      emit('dm-out', { el: target })

      // 恢复弹幕的层级
      target.style.zIndex = ''

      if (props.performanceMode) {
        // 性能模式下，恢复单个弹幕的动画
        const width = target.offsetWidth
        rafAnimation.resumeAnimation(
          target as HTMLDivElement,
          width,
          containerWidth.value,
          danmu.speeds,
          () => paused.value,
          handleAnimationEnd
        )
      } else {
        // CSS动画模式下，移除暂停类
        target.classList.remove('pause')
      }

      // 容错处理
      suspendDanmus.forEach((item) => {
        // 恢复所有弹幕的层级
        item.style.zIndex = ''

        if (props.performanceMode) {
          const width = item.offsetWidth
          rafAnimation.resumeAnimation(
            item as HTMLDivElement,
            width,
            containerWidth.value,
            danmu.speeds,
            () => paused.value,
            handleAnimationEnd
          )
        } else {
          item.classList.remove('pause')
        }
      })
      suspendDanmus = []
    }

    // 清理元素的所有事件监听器和引用
    function cleanupElement(el: HTMLDivElement) {
      // 处理requestAnimationFrame动画
      if (props.performanceMode) {
        // 取消该元素的动画帧
        rafAnimation.cancelAnimation(el)
      } else {
        // 移除animationend事件监听器
        if (el._animationEndHandler) {
          el.removeEventListener('animationend', el._animationEndHandler)
          delete el._animationEndHandler
        }
      }

      // 从轨道管理中移除对该元素的引用
      const channelIndex = el.dataset.channel ? parseInt(el.dataset.channel) : -1
      if (channelIndex >= 0 && danChannel.value[channelIndex]) {
        const index = danChannel.value[channelIndex].indexOf(el)
        if (index > -1) {
          danChannel.value[channelIndex].splice(index, 1)
        }
      }

      // 卸载Vue组件实例
      if (el._vueInstance && el._vueInstance.instance) {
        // 尝试使用unmount方法卸载组件实例
        try {
          el._vueInstance.instance.ctx.unmount && el._vueInstance.instance.ctx.unmount()
        } catch (e: unknown) {
          console.warn('Failed to unmount component instance', e)
        }
        delete el._vueInstance
      }
    }

    /**
     * 处理弹幕元素的样式、事件等
     */
    function processElement(el: HTMLDivElement, _index: number): void {
      let channelIndex = getChannelIndex(el)
      if (channelIndex >= 0) {
        const width = el.offsetWidth
        const height = danmu.height
        el.dataset.index = `${_index}`
        el.dataset.channel = channelIndex.toString()
        el.style.opacity = '1'
        el.style.top = channelIndex * (height + danmu.top) + 'px'
        el.style.width = width + danmu.right + 'px'

        if (props.performanceMode) {
          // 使用新的动画模块启动动画
          rafAnimation.startAnimation(
            el,
            width,
            containerWidth.value,
            danmu.speeds,
            () => paused.value,
            handleAnimationEnd
          )
        } else {
          // 使用CSS动画
          el.classList.add('move')
          el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + width}px`)
          el.style.left = `${containerWidth.value}px`
          el.style.animationDuration = `${containerWidth.value / danmu.speeds}s`

          const onAnimationEnd = () => {
            if (Number(el.dataset.index) === danmuList.value.length - 1 && !danmaku.loop) {
              emit('play-end', el.dataset.index)
            }

            // 清理元素前，移除所有事件监听器
            cleanupElement(el)

            if (dmContainer.value) {
              dmContainer.value.removeChild(el)
            }
          }

          el._animationEndHandler = onAnimationEnd
          el.addEventListener('animationend', onAnimationEnd)
        }

        index.value++
      } else {
        // 清理不能放入轨道的元素
        cleanupElement(el)
        if (dmContainer.value) {
          dmContainer.value.removeChild(el)
        }
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
