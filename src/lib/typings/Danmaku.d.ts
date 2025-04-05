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
