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
import { DanChannel, DanmuItem, DanmakuItem, DanmakuInstance, Danmu } from './typings/Danmaku'
import * as rafAnimation from './utils/rafAnimation'

function useModelWrapper<T>(props: any, emit: Function, name = 'modelValue', translater?: Function) {
  return computed<T>({
    get: () => props[name],
    set: (value) => {
      emit(`update:${name}`, translater ? translater(value) : value)
    },
  })
}

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
     * 循环模式下是否避免重复弹幕
     */
    loopOnly: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启随机轨道注入弹幕
     */
    randomChannel: {
      type: Boolean,
      default: false,
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
     * 弹幕默认层级
     */
    zIndex: {
      type: Number,
      default: 1,
    },
    /**
     * 是否自动监听容器大小变化
     */
    autoResize: {
      type: Boolean,
      default: true,
    },
    mirror: {
      type: Boolean,
      default: false,
    },
    /**
     * 初始时间偏移（秒）
     * 模拟已播放 n 秒后的弹幕状态，组件加载时屏幕上已有弹幕
     */
    startOffset: {
      type: Number,
      default: 0,
    },
  },
  emits: ['list-end', 'play-end', 'dm-over', 'dm-out', 'dm-click', 'dm-remove', 'error'],
  setup(props, { emit, slots, expose }) {
    // 容器
    let container = ref<HTMLDivElement>(document.createElement('div'))
    let dmContainer = ref<HTMLDivElement>(document.createElement('div'))
    const containerWidth = ref(0)
    const containerHeight = ref(0)
    const moveDirection = computed(() => (props.mirror ? 1 : -1)) // 1/-1
    // 添加计算属性，优化方向相关的逻辑
    const startPosition = computed(() => (props.mirror ? 'right' : 'left'))
    // 变量
    let timer: number = 0
    const calcChannels = ref(0)
    const danmuHeight = ref(0)
    const index = ref<number>(0)
    const hidden = ref(false)
    const paused = ref(true)
    const danChannel = ref<DanChannel>({})
    const danmuList = ref<Danmu[]>([...props.danmus])
    // 监听 props.danmus 变化并同步
    watch(() => props.danmus, (newDanmus) => {
      danmuList.value = [...newDanmus]
    })
    // 存储当前屏幕上的弹幕索引值
    const activeIndexes = ref<Set<number>>(new Set())
    let resizeObserver: ResizeObserver | null = null

    useModelWrapper<Danmu[]>(props, emit, 'danmus')

    const danmaku: DanmakuItem = reactive({
      channels: computed(() => props.channels || calcChannels.value),
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
      if (props.autoResize) {
        initResizeObserver()
      }
    })

    onBeforeUnmount(() => {
      stop()
      if (dmContainer.value) {
        dmContainer.value.removeEventListener('mouseover', onMouseOver)
        dmContainer.value.removeEventListener('mouseout', onMouseOut)
      }

      // 清理resize observer
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }

      // 清理所有requestAnimationFrame
      if (props.performanceMode) {
        rafAnimation.cancelAllAnimations()
      }
    })

    function init() {
      updateContainerSize()
      props.isSuspend && initSuspendEvents()

      if (!slots.danmu) {
        emit('error', { message: '没有提供弹幕插槽内容(slot="danmu")，无法展示弹幕', code: 'NO_DANMU_SLOT' })
        console.error('[vue-danmaku] 警告：没有提供弹幕插槽内容(slot="danmu")，无法展示弹幕')
      }

      // 如果设置了初始时间偏移，先渲染初始状态的弹幕
      if (props.startOffset > 0 && danmuList.value.length > 0) {
        initWithOffset()
      }

      if (props.autoplay) {
        play()
      }
    }

    /**
     * 初始化带时间偏移的弹幕状态
     * 模拟已播放 startOffset 秒后的弹幕分布
     */
    function initWithOffset() {
      const offsetMs = props.startOffset * 1000 // 转换为毫秒
      const debounceMs = danmaku.debounce

      // 计算在 startOffset 时间内应该插入的弹幕数量
      const totalInsertCount = Math.floor(offsetMs / debounceMs)
      // 实际可插入的弹幕数量（不能超过弹幕列表长度，除非是循环模式）
      const maxIndex = props.loop ? totalInsertCount : Math.min(totalInsertCount, danmuList.value.length)

      // 用于存储需要预渲染的弹幕信息
      const danmusToRender: Array<{
        danmu: Danmu
        index: number
        elapsedTime: number // 该弹幕已经移动的时间（毫秒）
      }> = []

      // 遍历计算每条弹幕的状态
      for (let i = 0; i < maxIndex; i++) {
        const actualIndex = props.loop ? i % danmuList.value.length : i
        const insertTime = i * debounceMs // 该弹幕的插入时刻（毫秒）
        const elapsedTime = offsetMs - insertTime // 该弹幕已移动的时间（毫秒）

        // 只处理已经开始移动的弹幕
        if (elapsedTime > 0) {
          danmusToRender.push({
            danmu: danmuList.value[actualIndex],
            index: actualIndex,
            elapsedTime,
          })
        }
      }

      // 更新 index 到正确的位置
      index.value = maxIndex

      // 批量渲染弹幕
      danmusToRender.forEach((item) => {
        insertWithOffset(item.danmu, item.index, item.elapsedTime)
      })
    }

    /**
     * 在指定偏移位置插入弹幕
     * @param dm 弹幕数据
     * @param _index 弹幕索引
     * @param elapsedTime 已经过的时间（毫秒）
     */
    function insertWithOffset(dm: Danmu, _index: number, elapsedTime: number) {
      const el = getDmComponent(dm, _index).$el
      el.classList.add('dm')
      dmContainer.value.appendChild(el)
      el.style.opacity = '0'

      // 保存组件实例的引用
      el._vueInstance = {
        instance: el.__vueParentComponent || { ctx: {} },
        el: el,
      }

      nextTick(() => {
        if (!danmu.height) {
          danmuHeight.value = el.offsetHeight
        }
        if (!danmaku.channels) {
          calcChannels.value = Math.floor(containerHeight.value / (danmu.height + danmu.top))
        }
        processElementWithOffset(el, _index, elapsedTime)
      })
    }

    // 存储初始化阶段弹幕的计算位置（用于碰撞检测）
    const offsetDanmuPositions = ref<Map<HTMLDivElement, number>>(new Map())

    /**
     * 处理带偏移的弹幕元素
     */
    function processElementWithOffset(el: HTMLDivElement, _index: number, elapsedTime: number): void {
      const width = el.offsetWidth
      const height = danmu.height

      // 计算弹幕已移动的距离
      const movedDistance = (elapsedTime / 1000) * danmu.speeds
      // 计算弹幕当前位置（从容器右边缘开始算，即弹幕左边缘的 x 坐标）
      const currentPosition = containerWidth.value - movedDistance

      // 检查弹幕是否已经完全离开屏幕
      if (currentPosition < -width) {
        // 弹幕已离开屏幕，清理并跳过
        cleanupElement(el)
        if (dmContainer.value && el.parentNode === dmContainer.value) {
          dmContainer.value.removeChild(el)
        }
        return
      }

      // 检查弹幕是否还未进入屏幕（理论上不应该发生）
      if (currentPosition > containerWidth.value) {
        cleanupElement(el)
        if (dmContainer.value && el.parentNode === dmContainer.value) {
          dmContainer.value.removeChild(el)
        }
        return
      }

      // 获取轨道，传入当前弹幕的计算位置和宽度
      let channelIndex = getChannelIndexForOffset(el, currentPosition, width)

      if (channelIndex >= 0) {
        // 存储弹幕的计算位置，供后续弹幕的碰撞检测使用
        offsetDanmuPositions.value.set(el, currentPosition)

        el.dataset.index = `${_index}`
        el.dataset.channel = channelIndex.toString()
        el.style.opacity = '1'
        el.style.top = channelIndex * (height + danmu.top) + 'px'
        el.style.width = width + danmu.right + 'px'
        el.style.zIndex = props.zIndex.toString()

        // 添加点击事件监听器
        const clickHandler = (event: MouseEvent) => {
          emit('dm-click', { el, index: _index, danmu: danmuList.value[_index], event })
        }
        el.addEventListener('click', clickHandler)
        el._clickHandler = clickHandler

        // 在loop-only模式下，记录该弹幕索引为活跃状态
        if (props.loop && props.loopOnly) {
          activeIndexes.value.add(_index)
        }

        if (props.performanceMode) {
          // 使用 requestAnimationFrame 动画，从当前位置继续
          startAnimationWithOffset(el, width, currentPosition, elapsedTime)
        } else {
          // CSS 动画模式：设置初始位置并启动动画
          el.classList.add('move')
          el.style.setProperty('--dm-scroll-width', `${(containerWidth.value + width) * moveDirection.value}px`)
          el.style[startPosition.value] = `${containerWidth.value}px`

          // 计算剩余动画时间
          const totalDuration = (containerWidth.value + width) / danmu.speeds
          const remainingDuration = totalDuration - elapsedTime / 1000

          if (remainingDuration > 0) {
            el.style.animationDuration = `${totalDuration}s`
            // 设置动画延迟为负值，跳过已经过的部分
            el.style.animationDelay = `-${elapsedTime / 1000}s`

            const onAnimationEnd = () => {
              if (Number(el.dataset.index) === danmuList.value.length - 1 && !props.loop) {
                emit('play-end', el.dataset.index)
              }

              const dmIndex = Number(el.dataset.index)
              if (props.loop && props.loopOnly && dmIndex >= 0) {
                activeIndexes.value.delete(dmIndex)
              }

              emit('dm-remove', { el, index: dmIndex, danmu: dmIndex >= 0 ? danmuList.value[dmIndex] : null })
              cleanupElement(el)

              if (dmContainer.value && el.parentNode === dmContainer.value) {
                dmContainer.value.removeChild(el)
              }
            }

            el._animationEndHandler = onAnimationEnd
            el.addEventListener('animationend', onAnimationEnd)
          } else {
            // 动画应该已经结束，直接清理
            cleanupElement(el)
            if (dmContainer.value && el.parentNode === dmContainer.value) {
              dmContainer.value.removeChild(el)
            }
          }
        }
      } else {
        // 无法找到不重叠的轨道，清理元素不渲染
        cleanupElement(el)
        if (dmContainer.value && el.parentNode === dmContainer.value) {
          dmContainer.value.removeChild(el)
        }
      }
    }

    /**
     * 获取偏移模式下的轨道索引
     * @param el 弹幕元素
     * @param currentPosition 弹幕当前的计算位置（左边缘 x 坐标）
     * @param width 弹幕宽度
     * @returns 可用的轨道索引，-1 表示无可用轨道
     */
    function getChannelIndexForOffset(el: HTMLDivElement, currentPosition: number, width: number): number {
      // 初始化阶段不使用随机轨道，按顺序分配以确保弹幕不重叠
      let _channels = [...Array(danmaku.channels).keys()]

      // 新弹幕的右边缘位置
      const newDanmuRight = currentPosition + width
      // 安全间距，确保弹幕之间有足够的水平距离
      const safetyMargin = Math.max(danmu.right, 20)

      for (let i of _channels) {
        const items = danChannel.value[i]

        if (items && items.length) {
          let canInsert = true

          // 检查该轨道上的所有弹幕是否会与新弹幕重叠
          for (const existingEl of items) {
            const existingPosition = offsetDanmuPositions.value.get(existingEl)
            if (existingPosition === undefined) continue

            const existingWidth = existingEl.offsetWidth
            const existingRight = existingPosition + existingWidth

            // 检查是否重叠：
            // 新弹幕左边缘 < 已有弹幕右边缘 + 安全间距 且 新弹幕右边缘 + 安全间距 > 已有弹幕左边缘
            if (currentPosition < existingRight + safetyMargin && newDanmuRight + safetyMargin > existingPosition) {
              canInsert = false
              break
            }
          }

          if (canInsert) {
            danChannel.value[i].push(el)
            return i % danmaku.channels
          }
        } else {
          danChannel.value[i] = [el]
          return i % danmaku.channels
        }
      }

      // 所有轨道都有重叠，返回 -1 表示无法放置
      return -1
    }

    /**
     * 从指定位置开始动画（性能模式）
     */
    function startAnimationWithOffset(
      el: HTMLDivElement,
      width: number,
      currentPosition: number,
      elapsedTime: number
    ): void {
      const moveDirectionN = moveDirection.value * -1
      const startPos = containerWidth.value * moveDirectionN
      const endPos = -width * moveDirectionN

      // 计算当前的 transform 值
      const currentTranslateX = currentPosition - containerWidth.value

      el.style[startPosition.value] = `${containerWidth.value}px`
      el.style.transform = `translateX(${currentTranslateX}px)`

      // 存储当前位置到 rafAnimation
      const currentPosForRaf = startPos + (currentPosition - containerWidth.value) * moveDirectionN
      rafAnimation.setPosition(el, currentPosition * moveDirectionN)

      // 计算剩余动画时间
      const totalDuration = (containerWidth.value / danmu.speeds) * 1000
      const remainingTime = totalDuration - elapsedTime

      if (remainingTime <= 0) {
        // 动画应该已经结束
        handleAnimationEnd(el)
        return
      }

      // 启动动画，从当前位置继续
      rafAnimation.resumeAnimation(
        el,
        width,
        containerWidth.value,
        danmu.speeds,
        () => paused.value,
        handleAnimationEnd,
        moveDirection.value
      )
    }

    function updateContainerSize() {
      containerWidth.value = container.value.offsetWidth
      containerHeight.value = container.value.offsetHeight
      if (containerWidth.value === 0 || containerHeight.value === 0) {
        const errorMsg = '获取不到容器宽高'
        emit('error', { message: errorMsg, code: 'CONTAINER_SIZE_ERROR' })
        console.error(`[vue-danmaku] ${errorMsg}`)
      }
    }

    function play() {
      // 如果已经处于播放状态，直接返回，避免重复恢复动画
      if (!paused.value) return

      paused.value = false
      if (!timer) {
        timer = window.setInterval(() => draw(), danmaku.debounce)
      }

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

          if (props.loop) {
            if (screenDanmus < index.value) {
              // 一轮弹幕插入完毕
              emit('list-end')
              index.value = 0
              // 清空活跃索引记录
              if (props.loopOnly) {
                activeIndexes.value.clear()
              }
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
      const _index = props.loop ? index.value % danmuList.value.length : index.value

      // loop-only模式下是否可以插入当前弹幕
      if (props.loopOnly && activeIndexes.value.has(_index)) {
        return
      }

      const _danmu = dm || danmuList.value[_index]
      const el = getDmComponent(_danmu, _index).$el
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
    function getDmComponent(
      _danmu: Danmu,
      _index: number
    ): {
      $el: HTMLDivElement
      [key: string]: any
    } {
      const DmComponent = createApp({
        render() {
          return h('div', {}, [
            slots.danmu &&
              slots.danmu({
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
        // 设置默认层级
        el.style.zIndex = props.zIndex.toString()

        // 添加点击事件监听器
        const clickHandler = (event: MouseEvent) => {
          emit('dm-click', { el, index: _index, danmu: danmuList.value[_index], event })
        }
        el.addEventListener('click', clickHandler)
        el._clickHandler = clickHandler

        // 在loop-only模式下，记录该弹幕索引为活跃状态
        if (props.loop && props.loopOnly) {
          activeIndexes.value.add(_index)
        }

        if (props.performanceMode) {
          // 使用新的动画模块启动动画
          rafAnimation.startAnimation(
            el,
            width,
            containerWidth.value,
            danmu.speeds,
            () => paused.value,
            handleAnimationEnd,
            moveDirection.value
          )
        } else {
          // 使用CSS动画
          el.classList.add('move')
          el.style.setProperty('--dm-scroll-width', `${(containerWidth.value + width) * moveDirection.value}px`)
          el.style[startPosition.value] = `${containerWidth.value}px`
          el.style.animationDuration = `${containerWidth.value / danmu.speeds}s`

          const onAnimationEnd = () => {
            if (Number(el.dataset.index) === danmuList.value.length - 1 && !props.loop) {
              emit('play-end', el.dataset.index)
            }

            const dmIndex = Number(el.dataset.index)
            if (props.loop && props.loopOnly && dmIndex >= 0) {
              activeIndexes.value.delete(dmIndex)
            }

            // 触发弹幕移除事件
            emit('dm-remove', { el, index: dmIndex, danmu: dmIndex >= 0 ? danmuList.value[dmIndex] : null })

            // 清理元素前，移除所有事件监听器
            cleanupElement(el)

            if (dmContainer.value && el.parentNode === dmContainer.value) {
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
        if (dmContainer.value && el.parentNode === dmContainer.value) {
          dmContainer.value.removeChild(el)
        }
      }
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
            const danRight = getDanDistance(items[j]) - 10
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
    /**
     * 获取弹幕左侧到屏幕左侧的距离
     */
    function getDanLeft(el: HTMLDivElement) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleLeft = el.getBoundingClientRect().left || dmContainer.value.getBoundingClientRect().left + eleWidth
      return dmContainer.value.getBoundingClientRect().left + eleLeft
    }
    function getDanDistance(el: HTMLDivElement) {
      return props.mirror ? getDanLeft(el) : getDanRight(el)
    }

    function initSuspendEvents() {
      dmContainer.value.addEventListener('mouseover', onMouseOver)
      dmContainer.value.addEventListener('mouseout', onMouseOut)
    }

    /**
     * 清除内部计时器和状态变量
     */
    function clear() {
      clearInterval(timer)
      timer = 0
      index.value = 0
      activeIndexes.value.clear()
    }

    /**
     * 停止弹幕播放（停止播放，清理DOM元素，暂停弹幕系统）
     */
    function stop() {
      clear()

      // 清理所有弹幕元素
      if (dmContainer.value) {
        const danmuElements = Array.from(dmContainer.value.querySelectorAll('.dm'))
        danmuElements.forEach((dm) => {
          cleanupElement(dm as HTMLDivElement)
        })

        dmContainer.value.innerHTML = ''
      }

      if (props.performanceMode) {
        rafAnimation.cancelAllAnimations()
      }

      danChannel.value = {}
      paused.value = true
    }

    /**
     * 重置弹幕系统
     */
    function reset() {
      stop()

      danmuHeight.value = 0
      hidden.value = false

      updateContainerSize()
    }

    /**
     * 暂停弹幕
     */
    function pause(): void {
      paused.value = true

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
            handleAnimationEnd,
            moveDirection.value
          )
        })
      }
    }

    /**
     * 处理动画结束事件
     */
    function handleAnimationEnd(el: HTMLDivElement) {
      if (Number(el.dataset.index) === danmuList.value.length - 1 && !props.loop) {
        emit('play-end', el.dataset.index)
      }

      // 触发弹幕移除事件
      const _index = Number(el.dataset.index)
      if (props.loop && props.loopOnly && _index >= 0) {
        activeIndexes.value.delete(_index)
      }
      emit('dm-remove', { el, index, danmu: _index >= 0 ? danmuList.value[_index] : null })

      // 清理元素
      cleanupElement(el)

      if (dmContainer.value && el.parentNode === dmContainer.value) {
        dmContainer.value.removeChild(el)
      }
    }

    /**
     * 添加弹幕
     * @param danmu 弹幕内容
     * @param position 插入位置，'current'表示当前播放位置，'end'表示末尾，默认为'end'
     * @returns 插入的索引位置
     */
    function addDanmu(danmu: Danmu, position: 'current' | 'end' = 'current'): number {
      if (position === 'current') {
        if (index.value === danmuList.value.length) {
          // 如果当前弹幕已经播放完了，那么仍然插入到末尾
          danmuList.value.push(danmu)
          return danmuList.value.length - 1
        } else {
          const _index = index.value % danmuList.value.length
          danmuList.value.splice(_index, 0, danmu)
          return _index + 1
        }
      } else {
        // 插入到末尾
        danmuList.value.push(danmu)
        return danmuList.value.length - 1
      }
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
      const oldContainerWidth = containerWidth.value // 保存旧容器宽度用于计算进度比例
      updateContainerSize()
      const items = dmContainer.value.getElementsByClassName('dm')

      for (let i = 0; i < items.length; i++) {
        const el = items[i] as HTMLDivElement
        const width = el.offsetWidth

        if (props.performanceMode) {
          // 获取当前位置信息
          const currentPosition = el.getBoundingClientRect().left
          const containerLeft = container.value.getBoundingClientRect().left

          // 计算已移动距离和总距离
          const totalDistance = oldContainerWidth + width
          const movedDistance = oldContainerWidth - (currentPosition - containerLeft)

          // 计算进度比例
          let progressRatio = movedDistance / totalDistance
          progressRatio = Math.max(0, Math.min(1, progressRatio))

          rafAnimation.cancelAnimation(el)

          if (progressRatio >= 1) {
            // 如果已经播放完成，直接触发结束事件
            handleAnimationEnd(el)
          } else {
            const newStartX = containerWidth.value - (containerWidth.value + width) * progressRatio

            el.style[startPosition.value] = `${containerWidth.value}px`
            el.style.transform = `translateX(${newStartX - containerWidth.value}px)`

            rafAnimation.resumeAnimation(
              el,
              width,
              containerWidth.value,
              danmu.speeds,
              () => paused.value,
              handleAnimationEnd,
              moveDirection.value
            )
          }
        } else {
          // CSS动画模式下的处理
          el.style.setProperty('--dm-scroll-width', `${(containerWidth.value + width) * moveDirection.value}px`)
          el.style[startPosition.value] = `${containerWidth.value}px`
          el.style.animationDuration = `${containerWidth.value / danmu.speeds}s`
        }
      }
    }

    // 提取事件处理函数为命名函数，以便可以移除
    let suspendDanmus: HTMLElement[] = []
    function onMouseOver(e: MouseEvent) {
      let target = e.target as EventTarget & HTMLElement

      if (!target.classList.contains('dm')) {
        target = target.closest('.dm') || target
      }

      if (!target.classList.contains('dm')) return

      if (suspendDanmus.includes(target)) return

      emit('dm-over', { el: target })

      // 提高暂停弹幕的层级，在默认层级基础上+1
      target.style.zIndex = (props.zIndex + 1).toString()

      if (props.performanceMode) {
        rafAnimation.cancelAnimation(target)
      } else {
        target.classList.add('pause')
      }

      suspendDanmus.push(target)
    }

    function onMouseOut(e: MouseEvent) {
      let target = e.target as EventTarget & HTMLElement

      if (!target.classList.contains('dm')) {
        target = target.closest('.dm') || target
      }

      if (!target.classList.contains('dm')) return

      emit('dm-out', { el: target })

      // 恢复单个目标元素
      resumeSuspendedDanmu(target)

      // 恢复所有暂停的弹幕
      suspendDanmus.forEach(resumeSuspendedDanmu)
      suspendDanmus = []
    }

    function resumeSuspendedDanmu(element: HTMLElement) {
      // 恢复弹幕的默认层级
      element.style.zIndex = props.zIndex.toString()

      if (props.performanceMode) {
        const width = element.offsetWidth
        rafAnimation.resumeAnimation(
          element as HTMLDivElement,
          width,
          containerWidth.value,
          danmu.speeds,
          () => paused.value,
          handleAnimationEnd,
          moveDirection.value
        )
      } else {
        element.classList.remove('pause')
      }
    }

    // 清理元素的所有事件监听器和引用
    function cleanupElement(el: HTMLDivElement) {
      // 处理requestAnimationFrame动画
      if (props.performanceMode) {
        rafAnimation.cancelAnimation(el)
      } else {
        if (el._animationEndHandler) {
          el.removeEventListener('animationend', el._animationEndHandler)
          delete el._animationEndHandler
        }
      }

      // 移除点击事件监听器
      if (el._clickHandler) {
        el.removeEventListener('click', el._clickHandler)
        delete el._clickHandler
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
      if (el.__vueApp) {
        try {
          el.__vueApp.unmount()
        } catch (e) {
          console.warn('卸载组件实例失败', e)
        }
        delete el.__vueApp
      }
      // 删除_vueInstance引用，简化清理流程
      if (el._vueInstance) {
        delete el._vueInstance
      }
    }

    function getMaxChannels(): number {
      if (!danmu.height) {
        return 0
      }
      return Math.floor(containerHeight.value / (danmu.height + danmu.top))
    }

    function initResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          resize()
        })
        resizeObserver.observe(container.value)
      } else {
        // 降级方案：使用window.resize
        const resizeHandler = () => resize()
        window.addEventListener('resize', resizeHandler)

        // 在组件销毁时确保移除事件监听
        onBeforeUnmount(() => {
          window.removeEventListener('resize', resizeHandler)
        })
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
      getMaxChannels,
      resize,
      play,
      pause,
      stop,
      show,
      hide,
      clear,
      reset,
      addDanmu,
      insert,
    }
  },
})
</script>
<style lang="scss">
.vue-danmaku {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
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
      color: #666;
      white-space: pre;
      cursor: default;
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
