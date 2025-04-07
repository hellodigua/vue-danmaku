/**
 * requestAnimationFrame动画管理器
 * 用于弹幕的性能模式动画处理
 */

// 存储所有动画帧ID的映射
const animationFrames = new Map<HTMLElement, number>()
// 存储所有弹幕元素当前位置的映射
const danmuPositions = new Map<HTMLElement, number>()
// 主循环的动画帧ID
let mainLoopFrameId: number | null = null

/**
 * 启动弹幕动画
 * @param el 弹幕DOM元素
 * @param width 弹幕宽度
 * @param containerWidth 容器宽度
 * @param speed 弹幕速度（像素/秒）
 * @param isPaused 是否处于暂停状态
 * @param onAnimationEnd 动画结束回调
 */
export function startAnimation(
  el: HTMLDivElement,
  width: number,
  containerWidth: number,
  speed: number,
  isPaused: () => boolean,
  onAnimationEnd: (el: HTMLDivElement) => void
): void {
  // 设置初始位置
  el.style.transform = `translateX(0px)`
  el.style.left = `${containerWidth}px`

  // 初始化动画参数
  const startTime = performance.now()
  const duration = (containerWidth / speed) * 1000 // 转换为毫秒
  const startPosition = containerWidth
  const endPosition = -width

  // 存储初始位置
  danmuPositions.set(el, startPosition)

  // 动画帧函数
  function animate(timestamp: number) {
    if (isPaused()) {
      // 如果暂停了，不继续请求动画帧
      return
    }

    const elapsed = timestamp - startTime

    if (elapsed >= duration) {
      // 动画结束
      onAnimationEnd(el)
      return
    }

    // 计算当前位置 (使用线性插值)
    const progress = elapsed / duration
    const currentPosition = startPosition + (endPosition - startPosition) * progress

    // 更新元素位置
    el.style.transform = `translateX(${currentPosition - startPosition}px)`

    // 存储当前位置
    danmuPositions.set(el, currentPosition)

    // 请求下一帧
    const frameId = requestAnimationFrame(animate)
    animationFrames.set(el, frameId)
  }

  // 启动动画
  const frameId = requestAnimationFrame(animate)
  animationFrames.set(el, frameId)
}

/**
 * 恢复弹幕动画
 * @param el 弹幕DOM元素
 * @param width 弹幕宽度
 * @param containerWidth 容器宽度
 * @param speed 弹幕速度
 * @param isPaused 是否处于暂停状态
 * @param onAnimationEnd 动画结束回调
 */
export function resumeAnimation(
  el: HTMLDivElement,
  width: number,
  containerWidth: number,
  speed: number,
  isPaused: () => boolean,
  onAnimationEnd: (el: HTMLDivElement) => void
): void {
  // 获取存储的位置
  const currentPosition = danmuPositions.get(el)

  if (currentPosition === undefined) {
    return
  }

  // 初始化动画参数，根据当前位置计算
  const startTime = performance.now()
  const startPosition = currentPosition
  const endPosition = -width

  // 重新计算剩余动画时间，基于剩余要移动的距离
  const remainingDistance = Math.abs(endPosition - startPosition)
  const duration = (remainingDistance / speed) * 1000 // 转换为毫秒

  // 动画帧函数
  function animate(timestamp: number) {
    if (isPaused()) {
      // 如果已暂停，则不继续请求动画帧
      return
    }

    const elapsed = timestamp - startTime

    if (elapsed >= duration) {
      // 动画结束
      onAnimationEnd(el)
      return
    }

    // 计算当前位置 (使用线性插值)
    const progress = elapsed / duration
    const position = startPosition + (endPosition - startPosition) * progress

    // 更新元素位置
    el.style.transform = `translateX(${position - containerWidth}px)`

    // 存储当前位置
    danmuPositions.set(el, position)

    // 请求下一帧
    const frameId = requestAnimationFrame(animate)
    animationFrames.set(el, frameId)
  }

  // 启动动画
  const frameId = requestAnimationFrame(animate)
  animationFrames.set(el, frameId)
}

/**
 * 暂停所有动画
 */
export function pauseAllAnimations(): void {
  // 取消所有动画帧，但保留位置信息
  animationFrames.forEach((frameId) => {
    cancelAnimationFrame(frameId)
  })

  // 清空动画帧映射，但保留位置信息
  animationFrames.clear()

  // 取消主循环
  cancelMainLoop()
}

/**
 * 取消元素的动画
 * @param el 弹幕DOM元素
 */
export function cancelAnimation(el: HTMLElement): void {
  const frameId = animationFrames.get(el)
  if (frameId) {
    cancelAnimationFrame(frameId)
    animationFrames.delete(el)
  }
}

/**
 * 取消所有动画，并清除位置信息
 */
export function cancelAllAnimations(): void {
  // 取消所有动画帧
  animationFrames.forEach((frameId) => {
    cancelAnimationFrame(frameId)
  })

  // 清空所有映射
  animationFrames.clear()
  danmuPositions.clear()

  // 取消主循环
  cancelMainLoop()
}

/**
 * 开始主循环（适用于需要持续运行的动画系统）
 * @param callback 主循环回调函数
 */
export function startMainLoop(callback: (timestamp: number) => void): void {
  // 先取消之前的主循环
  cancelMainLoop()

  // 启动新的主循环
  function loop(timestamp: number) {
    callback(timestamp)
    mainLoopFrameId = requestAnimationFrame(loop)
  }

  mainLoopFrameId = requestAnimationFrame(loop)
}

/**
 * 取消主循环
 */
export function cancelMainLoop(): void {
  if (mainLoopFrameId !== null) {
    cancelAnimationFrame(mainLoopFrameId)
    mainLoopFrameId = null
  }
}

/**
 * 获取元素的当前位置
 * @param el 弹幕DOM元素
 */
export function getElementPosition(el: HTMLElement): number | undefined {
  return danmuPositions.get(el)
}

/**
 * 获取所有有位置记录的弹幕元素
 */
export function getAllAnimatedElements(): HTMLElement[] {
  return Array.from(danmuPositions.keys())
}
