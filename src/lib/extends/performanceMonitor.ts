/**
 * 性能监控模块
 * 提供FPS监控和弹幕性能监控功能
 */

// 类型定义
type EmitFn = (event: string, ...args: any[]) => void
type PerformanceWarningCallback = (data: { count: number; threshold: number; message: string }) => void
type FpsDropCallback = (data: { fps: number; threshold: number }) => void

// 默认阈值
const DEFAULT_FPS_THRESHOLD = 30 // 低于此值视为FPS下降
const DEFAULT_WARNING_DANMU_COUNT = 100 // 超过此值发出性能警告

/**
 * FPS监控类
 */
class FpsMonitor {
  private fpsMonitorTimer: number = 0
  private lastTime: number = 0
  private frames: number = 0
  private fps: number = 0
  private fpsThreshold: number
  private running: boolean = false
  private onFpsDrop: FpsDropCallback

  constructor(fpsThreshold: number = DEFAULT_FPS_THRESHOLD, onFpsDrop?: FpsDropCallback) {
    this.fpsThreshold = fpsThreshold
    this.onFpsDrop = onFpsDrop || (() => {})
  }

  /**
   * 开始监控FPS
   */
  start(): void {
    if (this.running) return
    this.running = true

    const updateFPS = () => {
      if (!this.running) return

      const now = performance.now()
      this.frames++

      if (now > this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (now - this.lastTime))

        if (this.fps < this.fpsThreshold) {
          this.onFpsDrop({
            fps: this.fps,
            threshold: this.fpsThreshold,
          })
        }

        this.frames = 0
        this.lastTime = now
      }

      requestAnimationFrame(updateFPS)
    }

    this.fpsMonitorTimer = window.setTimeout(() => {
      this.lastTime = performance.now()
      requestAnimationFrame(updateFPS)
    }, 1000)
  }

  /**
   * 停止监控FPS
   */
  stop(): void {
    this.running = false
    if (this.fpsMonitorTimer) {
      clearTimeout(this.fpsMonitorTimer)
      this.fpsMonitorTimer = 0
    }
  }

  /**
   * 获取当前FPS
   */
  getCurrentFps(): number {
    return this.fps
  }

  /**
   * 设置FPS下降回调函数
   */
  setFpsDropCallback(callback: FpsDropCallback): void {
    this.onFpsDrop = callback
  }

  /**
   * 设置FPS阈值
   */
  setFpsThreshold(threshold: number): void {
    this.fpsThreshold = threshold
  }
}

/**
 * 弹幕性能监控器
 */
class DanmakuPerformanceMonitor {
  private warningThreshold: number
  private onPerformanceWarning: PerformanceWarningCallback

  constructor(
    warningThreshold: number = DEFAULT_WARNING_DANMU_COUNT,
    onPerformanceWarning?: PerformanceWarningCallback
  ) {
    this.warningThreshold = warningThreshold
    this.onPerformanceWarning = onPerformanceWarning || (() => {})
  }

  /**
   * 检查弹幕数量是否超过阈值
   * @param count 当前弹幕数量
   */
  checkPerformance(count: number): void {
    if (count > this.warningThreshold) {
      this.onPerformanceWarning({
        count,
        threshold: this.warningThreshold,
        message: `当前弹幕数量(${count})超过阈值(${this.warningThreshold})，可能影响性能`,
      })
    }
  }

  /**
   * 设置性能警告回调函数
   */
  setWarningCallback(callback: PerformanceWarningCallback): void {
    this.onPerformanceWarning = callback
  }

  /**
   * 设置警告阈值
   */
  setWarningThreshold(threshold: number): void {
    this.warningThreshold = threshold
  }
}

/**
 * 创建FPS监控器
 * @param fpsThreshold FPS阈值，低于此值触发回调
 * @param onFpsDrop FPS下降回调函数
 */
export function createFpsMonitor(fpsThreshold?: number, onFpsDrop?: FpsDropCallback): FpsMonitor {
  return new FpsMonitor(fpsThreshold, onFpsDrop)
}

/**
 * 创建弹幕性能监控器
 * @param warningThreshold 弹幕数量警告阈值
 * @param onPerformanceWarning 性能警告回调函数
 */
export function createDanmakuPerformanceMonitor(
  warningThreshold?: number,
  onPerformanceWarning?: PerformanceWarningCallback
): DanmakuPerformanceMonitor {
  return new DanmakuPerformanceMonitor(warningThreshold, onPerformanceWarning)
}

/**
 * 为vue-danmaku组件创建性能监控
 * 便捷方法，同时创建FPS监控和弹幕性能监控
 * @param options 配置选项
 */
export function createDanmakuMonitor(
  options: {
    fpsThreshold?: number
    warningThreshold?: number
    onFpsDrop?: FpsDropCallback
    onPerformanceWarning?: PerformanceWarningCallback
  } = {}
) {
  const fpsMonitor = createFpsMonitor(options.fpsThreshold, options.onFpsDrop)
  const performanceMonitor = createDanmakuPerformanceMonitor(options.warningThreshold, options.onPerformanceWarning)

  return {
    fpsMonitor,
    performanceMonitor,

    // 启动所有监控
    startAll() {
      fpsMonitor.start()
    },

    // 停止所有监控
    stopAll() {
      fpsMonitor.stop()
    },

    // 检查弹幕数量
    checkDanmakuCount(count: number) {
      performanceMonitor.checkPerformance(count)
    },
  }
}

// 导出默认阈值常量，方便用户自定义
export const PERFORMANCE_CONSTANTS = {
  DEFAULT_FPS_THRESHOLD,
  DEFAULT_WARNING_DANMU_COUNT,
}

export type { FpsDropCallback, PerformanceWarningCallback }
