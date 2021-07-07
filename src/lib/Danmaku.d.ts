/**
 * 弹幕轨道
 */
export interface DanChannel {
  [index: number]: [HTMLDivElement]
}

/**
 * 弹幕元素属性
 */
export interface DanmuItem {
  height: number
  fontSize: number
  speed: number
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
  useSlot: boolean
  debounce: number
  randomChannel: boolean
}
