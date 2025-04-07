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
  autoplay: boolean
  loop: boolean
  debounce: number
  randomChannel: boolean
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
