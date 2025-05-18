// 导出主组件
import Danmaku from './Danmaku.vue'
export { default as Danmaku } from './Danmaku.vue'

// 导出弹幕相关类型
import type { DanmakuInstance, Danmu } from './typings/Danmaku'
export type { DanmakuInstance, Danmu }

// 默认导出
export default Danmaku
