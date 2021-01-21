# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-14kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue.js 的弹幕交互组件

Live Demo： [https://hellodigua.github.io/vue-danmaku](https://hellodigua.github.io/vue-danmaku)

## Feature

- 🍖 灵活配置
- 🎉 海量弹幕
- 🍒 弹幕插槽
- 🐳 支持移动端

## Preview

![1.gif](https://i.loli.net/2021/01/18/AhqP2nZBtLg9uwl.gif)

自定义样式和海量弹幕：

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

## 自定义弹幕

自 0.3.1 版本起，vue-danmaku 支持通过 slot 插槽来自定义弹幕结构与样式，你可以传入任意结构的对象并通过 slot 渲染出来。

```vue
<template>
  <vue-danmaku ref="danmaku" :danmus="danmus" :config="config">
    <!-- 弹幕插槽（vue 2.6.0 以下请使用 slot-scope语法） -->
    <template v-slot:dm="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
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
      config: {
        slot: true,
        channels: 5,
        loop: true,
        speed: 5
      }
    }
  }
}
</script>
```

## Attributes

| 参数   | 说明                                   | 类型     | 可选值 | 默认值 |
| :----- | :------------------------------------- | :------- | :----- | :----- |
| config | 弹幕配置                               | [Object] |        | 见下表 |
| danmus | 弹幕元素列表，支持纯文本或者自定义对象 | [Array]  |        |        |

## Config Attributes

| 参数     | 说明                                | 类型      | 可选值 | 默认值                 |
| :------- | :---------------------------------- | :-------- | :----- | :--------------------- |
| channels | 轨道数量                            | [Number]  |        | 0 容器可容纳最高轨道数 |
| autoplay | 是否自动播放                        | [Boolean] |        | true                   |
| slot     | 是否开启弹幕插槽                    | [Boolean] |        | false                  |
| loop     | 是否开启弹幕循环                    | [Boolean] |        | false                  |
| fontSize | 弹幕字号（slot 模式下不可用）       | [Number]  |        | 20                     |
| speed    | 弹幕速度(s)（弹幕滚动过一屏的秒数） | [Number]  |        | 10                     |
| debounce | 弹幕刷新频率(ms)                    | [Number]  |        | 50                     |
| top      | 弹幕垂直间距(px)                    | [Number]  |        | 4                      |
| right    | 弹幕水平间距(px) （额外宽度）       | [Number]  |        | 0                      |

## Methods

| 方法名      | 说明                                         | 参数 |
| :---------- | :------------------------------------------- | :--- |
| play        | 开始弹幕播放                                 |      |
| pause       | 暂停弹幕播放                                 |      |
| stop        | 清空弹幕并停止播放                           |      |
| setChannels | 动态设置轨道数                               |      |
| show        | 弹幕显示                                     |      |
| hide        | 弹幕隐藏                                     |      |
| reset       | 重置配置                                     |      |
| resize      | 容器尺寸改变时重新计算滚动距离（需手动调用） |      |
| add         | 新增弹幕                                     |      |

## Changelog

- [x] 弹幕暂停 v0.0.5
- [x] 弹幕速度 v0.0.5
- [x] 轨道控制 v0.0.5
- [x] 弹幕循环 v0.0.5
- [x] 弹幕速度 v0.0.6
- [x] 弹幕字号 v0.0.6
- [x] 新增弹幕 v0.0.6
- [x] 移动端支持 v0.1.0
- [x] 弹幕插槽 v0.2.0
- [x] Make Core Code Great Again v0.3.0
- [x] 设置弹幕距离 v0.3.0
- [x] 打包体积优化 v0.3.1
- [x] 新增自动播放 v0.3.2
- [x] 容器尺寸改变时，重新计算滚动距离 v0.3.2
- [ ] 弹幕操作事件 -> 动工中
- [ ] 随机轨道发送 - > 动工中
- [ ] 顶部弹幕 - > pending
- [ ] 倒放模式 -> pending
- [ ] 时间控制器 - > pending
- [ ] TS 类型支持
- [ ] 支持 Vue3
