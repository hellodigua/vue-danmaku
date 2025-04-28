// 导出主组件
import Danmaku from './Danmaku.vue'
export { default as Danmaku } from './Danmaku.vue'

// 导出性能监控模块
import {
  createFpsMonitor,
  createDanmakuPerformanceMonitor,
  createDanmakuMonitor,
  PERFORMANCE_CONSTANTS,
} from './extends/performanceMonitor'
export { createFpsMonitor, createDanmakuPerformanceMonitor, createDanmakuMonitor, PERFORMANCE_CONSTANTS }

// 导出类型
import type { FpsDropCallback, PerformanceWarningCallback } from './extends/performanceMonitor'
export type { FpsDropCallback, PerformanceWarningCallback }

// 导出弹幕相关类型
import type { DanmakuInstance, Danmu } from './typings/Danmaku'
export type { DanmakuInstance, Danmu }

// 默认导出
export default Danmaku
