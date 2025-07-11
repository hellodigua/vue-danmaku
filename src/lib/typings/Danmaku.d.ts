/**
 * 自定义弹幕
 */
export type CustomDanmu<T = any> = {
  [key: string]: T
}

/**
 * 弹幕类型
 */
export type Danmu = string | CustomDanmu

/**
 * 弹幕轨道
 */
export interface DanChannel {
  [index: number]: HTMLDivElement[]
}

/**
 * 弹幕元素属性
 */
export interface DanmuItem {
  height: number
  speeds: number
  top: number
  right: number
}

/**
 * 弹幕库属性
 */
export interface DanmakuItem {
  channels: number
  debounce?: number
  randomChannel?: boolean
}

/**
 * Vue组件实例类型
 */
export interface VueComponentInstance {
  ctx: {
    unmount?: () => void
  }
  [key: string]: any
}

/**
 * Vue应用实例类型
 */
export interface VueAppInstance {
  unmount: () => void
  [key: string]: any
}

/**
 * 自定义弹幕元素接口扩展
 */
declare global {
  interface HTMLDivElement {
    /**
     * AnimationEnd事件处理函数引用
     */
    _animationEndHandler?: (event: AnimationEvent) => void

    /**
     * Click事件处理函数引用
     */
    _clickHandler?: (event: MouseEvent) => void

    /**
     * Vue组件实例引用
     */
    _vueInstance?: {
      instance: VueComponentInstance
      el: HTMLDivElement
    }

    /**
     * Vue应用实例引用
     */
    __vueApp?: VueAppInstance

    /**
     * Vue父组件引用
     */
    __vueParentComponent?: VueComponentInstance
  }
}

/**
 * 弹幕组件类型
 */
type DanmakuComponent = typeof import('./Danmaku.vue').default

/**
 * 弹幕组件实例类型
 */
export type DanmakuInstance = InstanceType<DanmakuComponent> & {
  /**
   * 是否隐藏弹幕
   */
  hidden: boolean

  /**
   * 是否暂停弹幕
   */
  paused: boolean

  /**
   * 获取播放状态
   */
  getPlayState(): boolean

  /**
   * 调整容器大小
   */
  resize(): void

  /**
   * 开始播放弹幕
   */
  play(): void

  /**
   * 暂停弹幕
   */
  pause(): void

  /**
   * 停止弹幕
   */
  stop(): void

  /**
   * 显示弹幕
   */
  show(): void

  /**
   * 隐藏弹幕
   */
  hide(): void

  /**
   * 清空弹幕
   */
  clear(): void

  /**
   * 重置弹幕
   */
  reset(): void

  /**
   * 添加弹幕
   * @param danmu 弹幕内容
   * @param position 插入位置，'current'表示当前播放位置，'end'表示末尾，默认为'current'
   * @returns 插入的索引位置
   */
  addDanmu(danmu: Danmu, position?: 'current' | 'end'): number

  /**
   * 插入弹幕
   * @param dm 外部定义的弹幕
   */
  insert(dm?: Danmu): void

  /**
   * 获取最大可容纳的弹幕轨道数
   */
  getMaxChannels(): number
}

/**
 * 弹幕组件属性类型
 */
export interface DanmakuProps {
  /**
   * 弹幕列表数据
   */
  danmus: Danmu[]
  /**
   * 轨道数量，0为最大轨道数量（撑满容器）
   */
  channels: number
  /**
   * 是否自动播放
   */
  autoplay: boolean
  /**
   * 是否循环播放
   */
  loop: boolean
  /**
   * 循环模式下是否避免重复弹幕
   */
  loopOnly: boolean
  /**
   * 是否开启随机轨道注入弹幕
   */
  randomChannel: boolean
  /**
   * 是否开启悬浮暂停
   */
  isSuspend: boolean
  /**
   * 性能模式，启用时使用requestAnimationFrame代替CSS动画
   */
  performanceMode: boolean
  /**
   * 弹幕刷新频率(ms)
   */
  debounce: number
  /**
   * 弹幕速度（像素/秒）
   */
  speeds: number
  /**
   * 弹幕垂直间距
   */
  top: number
  /**
   * 弹幕水平间距
   */
  right: number
  /**
   * 弹幕默认层级
   */
  zIndex: number
  /**
   * 是否自动监听容器大小变化
   */
  autoResize: boolean
  /**
   * 是否开启镜像模式（弹幕从左向右移动）
   */
  mirror: boolean
}
