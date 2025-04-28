# 性能

## 性能优化建议

当遇到弹幕渲染性能问题时，可以参考以下优化建议：

1. **减少同屏弹幕数量**:

   - 调整 `debounce` 值增加弹幕刷新间隔
   - 减少轨道数量 `channels`

2. **简化弹幕 DOM 结构**:

   - 减少弹幕内部的 DOM 元素数量
   - 避免在弹幕中使用复杂的 CSS 效果

3. **调整弹幕速度**:

   - 适当降低 `speeds` 值减轻渲染压力

4. **使用简单的文本弹幕**:

   - 在高并发场景下使用纯文本弹幕代替复杂结构

5. **启用性能监控**:
   - 使用内置的性能监控工具实时监测性能
   - 当 FPS 降低时自动调整参数

## 常见问题

**Q: 为什么在移动设备上弹幕动画不流畅？**

A: 移动设备性能有限，建议:

- 减少同屏弹幕数量
- 简化弹幕 DOM 结构

**Q: 大量弹幕导致页面卡顿怎么办？**

A: 当弹幕数量过多时，可以:

- 使用 `addDanmu` 方法有选择地添加重要弹幕，而不是全部加载
- 使用 `insert` 方法实时插入弹幕而不存储到数据中
- 根据性能监控结果动态调整弹幕参数

## 性能模式

vue-danmaku 默认开启了性能模式，使用 `requestAnimationFrame` 代替 CSS 动画，在大多数场景下能够获得更加稳定的帧率：

```vue
<template>
  <vue-danmaku v-model:danmus="danmus" :performanceMode="true" style="height: 200px;" />
</template>
```

## 性能监控模块

从 v2.0.0 版本开始，vue-danmaku 将提供性能监控模块，这些工具可以帮助你监测弹幕渲染性能和帧率情况。

### FPS 监控

监控页面的帧率，当低于阈值时触发回调：

```js
import { createFpsMonitor } from 'vue-danmaku'

// 创建FPS监控，阈值设为30帧
const fpsMonitor = createFpsMonitor(30, (data) => {
  console.log(`FPS下降到${data.fps}，低于阈值${data.threshold}`)
})

// 开始监控
fpsMonitor.start()

// 停止监控
fpsMonitor.stop()
```

### 弹幕数量监控

监控弹幕数量，当超过阈值时触发回调：

```js
import { createDanmakuPerformanceMonitor } from 'vue-danmaku'

// 创建弹幕性能监控，阈值设为100条弹幕
const performanceMonitor = createDanmakuPerformanceMonitor(100, (data) => {
  console.log(data.message) // 弹幕数量超过阈值警告
})

// 检查弹幕数量
performanceMonitor.checkPerformance(110) // 将触发警告回调
```

### 全面监控

同时创建 FPS 和弹幕性能监控：

```js
import { createDanmakuMonitor } from 'vue-danmaku'

// 创建完整监控
const monitor = createDanmakuMonitor({
  fpsThreshold: 25, // FPS阈值
  warningThreshold: 150, // 弹幕数量阈值
  onFpsDrop: (data) => console.log(`FPS下降: ${data.fps}`),
  onPerformanceWarning: (data) => console.log(`性能警告: ${data.message}`),
})

// 启动所有监控
monitor.startAll()

// 检查弹幕数量
monitor.checkDanmakuCount(160) // 检查弹幕数量

// 停止所有监控
monitor.stopAll()
```

## 在 Vue 组件中使用

以下是一个在 Vue 组件中结合使用 vue-danmaku 和性能监控模块的完整示例：

```vue
<template>
  <div>
    <vue-danmaku ref="danmakuRef" v-model:danmus="danmus" style="height: 300px;">
      <template #danmu="{ danmu, index }">
        <div class="danmu-item">
          {{ danmu }}
        </div>
      </template>
    </vue-danmaku>
    <div class="performance-panel">
      <h3>性能监控面板</h3>
      <div>当前FPS: {{ currentFps }}</div>
      <div>弹幕数量: {{ danmus.length }}</div>
      <div class="warning" v-if="warnings.length">
        <div v-for="(warning, index) in warnings" :key="index">
          {{ warning }}
        </div>
      </div>
      <button @click="addManyDanmus">添加大量弹幕测试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import vueDanmaku, { createDanmakuMonitor } from 'vue-danmaku'

const danmakuRef = ref(null)
const danmus = ref(['基础弹幕数据...'])
const currentFps = ref(0)
const warnings = ref([])

// 创建性能监控实例
const monitor = createDanmakuMonitor({
  fpsThreshold: 30,
  warningThreshold: 100,
  onFpsDrop: (data) => {
    currentFps.value = data.fps
    warnings.value.push(`FPS下降到${data.fps}，低于阈值${data.threshold}`)
  },
  onPerformanceWarning: (data) => {
    warnings.value.push(`性能警告: ${data.message}`)
  },
})

// 获取当前FPS的更新函数
const updateFps = () => {
  if (monitor._fpsMonitor) {
    currentFps.value = monitor._fpsMonitor.getFps() || 0
    requestAnimationFrame(updateFps)
  }
}

// 添加大量弹幕测试性能
const addManyDanmus = () => {
  for (let i = 0; i < 150; i++) {
    danmus.value.push(`性能测试弹幕${i}`)
  }
  // 手动检查弹幕数量
  monitor.checkDanmakuCount(danmus.value.length)
}

onMounted(() => {
  // 启动性能监控
  monitor.startAll()
  // 开始更新FPS显示
  updateFps()
})

onUnmounted(() => {
  // 组件销毁时停止监控
  monitor.stopAll()
})
</script>

<style scoped>
.performance-panel {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.warning {
  color: red;
  margin-top: 10px;
}
</style>
```
