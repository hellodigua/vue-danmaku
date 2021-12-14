# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue.js 的弹幕交互组件

Live Demo： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

现已支持 vue3.x：[vue3-danmaku](https://github.com/hellodigua/vue-danmaku/tree/vue3)

## Preview

![1.gif](https://i.loli.net/2021/01/18/AhqP2nZBtLg9uwl.gif)

支持自定义样式和海量弹幕：

![2.gif](https://i.loli.net/2021/01/18/Rn3rHJeoAEsbiwZ.gif)

## Install

```bash
$ npm install vue-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku :danmus="danmus"></vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  data() {
    return {
      danmus: ['danmu1', 'danmu2', 'danmu3', '...'],
    }
  },
}
</script>
```

## Attributes

| 参数          | 说明                                   | 类型    | 可选值       | 默认值 |
| :------------ | :------------------------------------- | :------ | :----------- | :----- |
| danmus        | 弹幕元素列表，支持纯文本或者自定义对象 | Array   | 字符串或对象 | []     |
| channels      | 轨道数量                               | Number  |              | 0      |
| autoplay      | 是否自动播放                           | Boolean |              | true   |
| useSlot       | 是否开启弹幕插槽                       | Boolean |              | false  |
| loop          | 是否开启弹幕循环                       | Boolean |              | false  |
| fontSize      | 弹幕字号（slot 模式下不可用）          | Number  |              | 18     |
| extraStyle    | 额外样式（slot 模式下不可用）          | String  |              |        |
| speeds        | 弹幕速度（每秒移动的像素数）           | Number  |              | 200    |
| debounce      | 弹幕刷新频率(ms)                       | Number  |              | 100    |
| randomChannel | 随机选择轨道插入                       | Boolean |              | false  |
| top           | 弹幕垂直间距(px)                       | Number  |              | 4      |
| right         | 弹幕水平间距(px)                       | Number  |              | 0      |

- 注 1：channels 为 0，则轨道数为容器可容纳最高轨道数
- 注 2：danmus 初始化后如果为空，则 autoplay 失效。因此对于异步加载的弹幕数据，需要手动调用 `this.$refs[refName].play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一次弹幕

## 内置方法

通过 `this.$refs[refName]` 调用

| 方法名      | 说明                                         | 参数                           |
| :---------- | :------------------------------------------- | :----------------------------- |
| play        | 开始/继续播放                                | -                              |
| pause       | 暂停弹幕播放                                 | -                              |
| stop        | 停止播放并清空弹幕                           | -                              |
| setChannels | 动态设置轨道数                               | Number                         |
| show        | 弹幕显示                                     | -                              |
| hide        | 弹幕隐藏                                     | -                              |
| reset       | 重置配置                                     | -                              |
| resize      | 容器尺寸改变时重新计算滚动距离（需手动调用） | -                              |
| push        | 发送弹幕（插入到弹幕列表末尾，排队显示）     | danmu 数据，可以是字符串或对象 |
| add         | 发送弹幕（插入到当前播放位置，实时显示）     | danmu 数据，可以是字符串或对象 |

- 注 1： push 适用于非循环模式，add 适用于循环模式

## Slot

如果你有自定义弹幕结构与样式的需求，你可以传入任意结构的对象并自己写内部样式。

```vue
<template>
  <vue-danmaku ref="danmaku" :danmus="danmus" useSlot loop :speed="8" :channels="5">
    <!-- 弹幕插槽（vue 2.6.0 及以上版本可使用 v-slot:dm="{ index, danmu }"语法） -->
    <template slot="dm" slot-scope="{ index, danmu }">
      <div>{{ index }}{{ danmu.name }}：{{ danmu.text }}</div>
    </template>
    <!-- 容器插槽 -->
    <div></div>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  data() {
    return {
      danmus: [{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...]
    }
  }
}
</script>
```

## 讨论交流和 BUG 反馈

QQ 群：747809274

## Changelog

### v1.2.1

- fix: 修复初始化时弹幕容器宽度可能出错的 BUG

### v1.2.0

- speed 参数改为 speeds 参数，含义同样发生变化(主要是为了保证不同屏幕下弹幕移动速度相同)
  - speed: 弹幕经过屏幕的总时长
  - speeds: 弹幕每秒走过的像素距离

### v1.1.1

- 新增 extraStyle，可控制普通弹幕的样式

### v1.1.0

- 新增弹幕插入方法

### v1.0.5

- fix: 修复 iOS 下平移闪烁的问题

### v1.0.3

- fix: 修复使用默认 slot 报错的 BUG

### v1.0.0

为了后续版本的易用性，组件参数改为直传。前版本文档请[点此查看](https://www.npmjs.com/package/vue-danmaku/v/0.3.6)

- 组件参数改为直传
- 部分代码重构

### v0.3.6

- 支持异步加载弹幕（备注：异步加载后应手动调用 play 方法）

### v0.3.4

- 支持随机轨道发送弹幕
- fix: 非循环模式，播放完成时不应当结束弹幕任务

### v0.3.2

- 支持自动播放
- 弹幕容器尺寸改变时，重新计算滚动距离

### v0.3.1

- 打包体积优化

### v0.3.0

Make Core Code Great Again

- 支持设置弹幕距离
- 支持设置弹幕刷新频率

### v0.2.0

- 支持弹幕插槽及对应样式优化

### v0.1.1

- fix: 修复 0.1.0 打包错误导致的无法下载

### v0.1.0

- 支持移动端播放

### v0.0.6

- 支持弹幕速度
- 支持弹幕字号
- 支持新增弹幕

### v0.0.5

- 支持弹幕暂停
- 支持轨道数控制
- 支持弹幕循环

### v0.0.1

Born in 2018.3.11

- 支持弹幕效果
