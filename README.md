# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-9kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue3 的弹幕交互组件

简体中文 | [English](https://github.com/hellodigua/vue-danmaku/blob/main/README_en.md)

<!-- 文档： [https://hellodigua.github.io/vue-danmaku-docs/](https://hellodigua.github.io/vue-danmaku-docs/) -->

> [!WARNING]
> 2.0.0 版本开始，vue-danmaku 仅支持 Vue3，[Vue2 版本文档请移步至此](https://github.com/hellodigua/vue-danmaku/tree/vue2)

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku v-model:danmus="danmus" loop style="height: 100px;">
    <template v-slot:danmu="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
    </template>
  </vue-danmaku>
</template>

<script setup>
import vueDanmaku from 'vue-danmaku'

const danmus = ref([
  { name: 'a', text: 'aaa' },
  { name: 'b', text: 'bbb' },
])
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

- 注 1：channels 为 0，则轨道数为容器可容纳最高轨道数
- 注 2：danmus 初始化后如果为空，则 autoplay 失效。因此对于异步加载的弹幕数据，需要手动调用 `refName.value.play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一条弹幕
- 注 4：性能模式默认使用 requestAnimationFrame 代替 CSS 动画，在浏览器不开启硬件加速时，FPS 会非常稳定

## Methods

通过以下方式调用：

```js
<vue-danmaku ref="danmakuRef">
  <template #danmu="{ danmu }">{{ danmu }}</template>
</vue-danmaku>

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
| getMaxChannels()          | 获得当前最大轨道数                           |                                                                                           |

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

## 讨论交流和 BUG 反馈

这个 [QA 文档](https://github.com/hellodigua/vue-danmaku/blob/main/QA.md) 收集了一些常见问题，可以做阅读参考

也可以给本项目 [提交 issue](https://github.com/hellodigua/vue-danmaku/issues)

如果 vue-danmaku 帮助到了你，欢迎 [star](https://github.com/hellodigua/vue-danmaku/) ヾ(_ゝ ω・_)ノ
