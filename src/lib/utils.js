export function throttle(fn, threshold) {
  // 记录上次执行的时间
  var last
  // 定时器
  var timer
  // 默认间隔为 250ms
  threshold || (threshold = 250)
  // 返回的函数，每过 threshold 毫秒就执行一次 fn 函数
  return function() {
    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments
    var now = +new Date()
    // 如果距离上次执行 fn 函数的时间小于 threshold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshold) {
      clearTimeout(timer)
      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(function() {
        last = now
        fn.apply(context, args)
      }, threshold)
      // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}
