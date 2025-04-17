# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-9kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue3 的弹幕交互组件

简体中文 | [English](https://github.com/hellodigua/vue-danmaku/blob/main/README_en.md)

文档： [https://hellodigua.github.io/vue-danmaku-docs/](https://hellodigua.github.io/vue-danmaku-docs/)

> [!WARNING]
> 2.0.0 版本开始，vue-danmaku 不再支持 Vue2 项目使用，仅支持 Vue3，如需使用 Vue2 版本，请移步至 [Vue2 版本链接](https://github.com/hellodigua/vue-danmaku/tree/vue2)

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku v-model:danmus="danmus" style="height: 100px;">
    <template v-slot:dm="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
    </template>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  setup(props) {
    const danmus = ref([{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...])

    return { danmus }
  },
}
</script>
```

## Attributes

| 参数            | 说明                                                             | 类型    | 可选值       | 默认值 |
| :-------------- | :--------------------------------------------------------------- | :------ | :----------- | :----- |
| danmus          | 弹幕元素列表，支持纯文本或者自定义对象(支持 v-model)             | Array   | 字符串或对象 | []     |
| channels        | 轨道数量                                                         | Number  |              | 0      |
| autoplay        | 是否自动播放                                                     | Boolean |              | true   |
| loop            | 是否开启弹幕循环                                                 | Boolean |              | false  |
| speeds          | 弹幕速度（每秒移动的像素数）                                     | Number  |              | 200    |
| debounce        | 弹幕刷新频率(ms)                                                 | Number  |              | 100    |
| randomChannel   | 随机选择轨道插入                                                 | Boolean |              | false  |
| isSuspend       | 是否开启弹幕悬浮暂停（试验型功能）                               | Boolean |              | false  |
| top             | 弹幕垂直间距(px)                                                 | Number  |              | 4      |
| right           | 弹幕水平间距(px)                                                 | Number  |              | 0      |
| performanceMode | 是否开启性能模式（默认使用 requestAnimationFrame 代替 CSS 动画） | Boolean |              | true   |
| zIndex          | 弹幕层级                                                         | Number  |              | 10     |

- 注 0：1.0.0 版本起，danmus 参数写法变为双向绑定 v-model:danmus
- 注 1：channels 为 0，则轨道数为容器可容纳最高轨道数
- 注 2：danmus 初始化后如果为空，则 autoplay 失效。因此对于异步加载的弹幕数据，需要手动调用 `refName.value.play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一条弹幕
- 注 4：性能模式默认使用 requestAnimationFrame 代替 CSS 动画，在浏览器不开启硬件加速时，FPS 会非常稳定

## Methods

通过以下方式调用：

```js
<vue-danmaku ref="danmakuRef"></vue-danmaku>

setup() {
  const danmakuRef = ref(null)

  danmakuRef.value.play()
}
```

| 方法名                    | 说明                                         | 参数                                                                                      |
| :------------------------ | :------------------------------------------- | :---------------------------------------------------------------------------------------- |
| play()                    | 开始/继续播放                                | -                                                                                         |
| pause()                   | 暂停弹幕播放                                 | -                                                                                         |
| stop()                    | 停止播放并清空弹幕                           | -                                                                                         |
| show()                    | 弹幕显示                                     | -                                                                                         |
| hide()                    | 弹幕隐藏                                     | -                                                                                         |
| reset()                   | 重置配置                                     | -                                                                                         |
| resize()                  | 容器尺寸改变时重新计算滚动距离（需手动调用） | -                                                                                         |
| addDanmu(danmu, position) | 发送弹幕（统一方法，可指定插入位置）         | danmu 数据，可以是字符串或对象；position: 当前插入的位置 'current','end'，默认为'current' |
| insert(danmu)             | 绘制弹幕（实时插入，不进行数据绑定）         | danmu 数据，可以是字符串或对象                                                            |
| getPlayState()            | 获得当前播放状态                             |                                                                                           |

- 注 1：push 和 add 方法已废弃，请使用 addDanmu 代替
- 注 2：insert 跟 addDanmu 的区别在于，insert 不存储于内部变量，而是直接插入 DOM，适用于直播等场景

## Events

| 事件名    | 说明                                           | 返回值                      |
| :-------- | :--------------------------------------------- | :-------------------------- |
| list-end  | 所有弹幕插入完毕                               | -                           |
| play-end  | 所有弹幕播放完成（已滚出屏幕）                 | index（最后一个弹幕的下标） |
| dm-over   | 开启弹幕悬浮暂停时，当进入弹幕，暂停时触发     | 触发的弹幕对象元素          |
| dm-out    | 开启弹幕悬浮暂停时，当离开弹幕，恢复滚动时触发 | 触发的弹幕对象元素          |
| dm-click  | 弹幕被点击时触发                               | {el, index, danmu, event}   |
| dm-remove | 弹幕被移除时触发                               | {el, index, danmu}          |
| error     | 发生错误时触发                                 | {message, code}             |

## 性能监控模块

vue-danmaku 提供了独立的性能监控模块，完全独立于主组件，用户可以根据需要自行导入使用：

```js
import {
  createFpsMonitor,
  createDanmakuPerformanceMonitor,
  createDanmakuMonitor,
  PERFORMANCE_CONSTANTS,
} from 'vue-danmaku'

// 创建FPS监控
const fpsMonitor = createFpsMonitor(30, (data) => {
  console.log(`FPS下降到${data.fps}，低于阈值${data.threshold}`)
})
fpsMonitor.start() // 开始监控
fpsMonitor.stop() // 停止监控

// 创建弹幕性能监控
const performanceMonitor = createDanmakuPerformanceMonitor(100, (data) => {
  console.log(data.message) // 弹幕数量超过阈值警告
})
performanceMonitor.checkPerformance(110) // 检查弹幕数量

// 同时创建FPS和弹幕性能监控
const monitor = createDanmakuMonitor({
  fpsThreshold: 25,
  warningThreshold: 150,
  onFpsDrop: (data) => console.log(`FPS下降: ${data.fps}`),
  onPerformanceWarning: (data) => console.log(`性能警告: ${data.message}`),
})
monitor.startAll() // 启动所有监控
monitor.checkDanmakuCount(160) // 检查弹幕数量
monitor.stopAll() // 停止所有监控
```

### 在组件中使用性能监控

您可以在组件中结合使用 vue-danmaku 组件和性能监控模块：

```vue
<template>
  <vue-danmaku ref="danmakuRef" v-model:danmus="danmus"></vue-danmaku>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import vueDanmaku, { createDanmakuMonitor } from 'vue-danmaku'

const danmakuRef = ref(null)
const danmus = ref(['弹幕1', '弹幕2', '弹幕3'])

// 创建性能监控实例
const monitor = createDanmakuMonitor({
  fpsThreshold: 30,
  warningThreshold: 100,
  onFpsDrop: (data) => {
    console.log(`FPS下降到${data.fps}`)
  },
  onPerformanceWarning: (data) => {
    console.log(`性能警告: ${data.message}`)
  },
})

onMounted(() => {
  // 启动性能监控
  monitor.startAll()

  // 在添加大量弹幕后检查性能
  const addManyDanmus = () => {
    for (let i = 0; i < 150; i++) {
      danmus.value.push(`大量弹幕${i}`)
    }
    // 手动检查弹幕数量
    monitor.checkDanmakuCount(danmus.value.length)
  }

  // 例如，5秒后添加大量弹幕
  setTimeout(addManyDanmus, 5000)
})

// 在组件销毁时停止监控
onUnmounted(() => {
  monitor.stopAll()
})
</script>
```

## 讨论交流和 BUG 反馈

这个 [QA 文档](https://github.com/hellodigua/vue-danmaku/blob/main/QA.md) 收集了一些常见问题，可以做阅读参考

也可以给本项目 [提交 issue](https://github.com/hellodigua/vue-danmaku/issues)

如果 vue-danmaku 帮助到了你，欢迎 [star](https://github.com/hellodigua/vue-danmaku/)，你的 star 是我改 BUG 的动力 ヾ(_ゝ ω・_)ノ

## Changelog

### v2.0.0

新增：

- 新增 addDanmu 方法，统一弹幕添加接口
- 新增 performanceMode 参数，默认开启性能模式
- 新增 zIndex 参数，默认 10
- 新增多个事件：dm-click, dm-remove, error
- 新增性能监控模块，可单独导入使用

优化：

- 在移除弹幕时清理相关引用
- 移除 useSlot 和文本模式，默认使用 slot 模式

移除：

- 移除以下参数： useSlot、fontSize、extraStyle
- 移除 push 和 add 方法
- 移除 fps-drop 和 performance-warning 事件
- 移除组件内置的性能监控功能

### v1.6.1

- fix: 修复定时器类型错误

### v1.6.0

- feat: 新增弹幕悬浮暂停相关事件

### v1.5.3

- feat: 初始化时获取不到容器宽高时抛出异常

### v1.5.2

- chore: 压缩打包体积

### v1.5.1

- fix: 修复部分场景下弹幕显示重叠的问题

### v1.4.0

- fix: 修复弹幕过长时后续弹幕不连贯的问题

### v1.3.0

- 更新了文档

### v1.2.0

- 优化 resize 逻辑
- fix: 修复 iOS15 下部分机型的 APP 内置 webview 在弹幕初始化时可能会闪屏的 BUG

### v1.1.0

- feat: 暴露 insert 方法，允许直接外部绘制弹幕

### v1.0.0

- 修复大量遗留 BUG
- 同步 Vue2 版本变更
- 支持 danmus 双向绑定

### v0.2.0

- speed 参数改为 speeds 参数，含义同样发生变化(主要是为了保证不同屏幕下弹幕移动速度相同)
  - speed: 弹幕经过屏幕的总时长
  - speeds: 弹幕每秒走过的像素距离

### v0.1.0

- 支持 vue3
