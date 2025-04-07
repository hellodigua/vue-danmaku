// 导出主组件
import Danmaku from './Danmaku.vue'
export { default as Danmaku } from './Danmaku.vue'

// 导出性能监控模块
export {
  createFpsMonitor,
  createDanmakuPerformanceMonitor,
  createDanmakuMonitor,
  PERFORMANCE_CONSTANTS,
} from './extends/performanceMonitor'

// 导出类型
export type { FpsDropCallback, PerformanceWarningCallback } from './extends/performanceMonitor'

// 默认导出
export default Danmaku
