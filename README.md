# vue3-danmaku

[![npm-version](https://img.shields.io/npm/v/vue3-danmaku.svg)](https://www.npmjs.com/package/vue3-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue3-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()
[![views](https://us-central1-trackgit-analytics.cloudfunctions.net/token/ping/l2vhhsgs5ei8uo1hftsl)](https://trackgit.com)

> 基于 Vue3 的弹幕交互组件

简体中文 | [English](https://github.com/hellodigua/vue-danmaku/blob/vue3/README_en.md)

Live Demo： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue3-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku v-model:danmus="danmus"></vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue3-danmaku'

export default {
  setup(props) {
    const danmus = ref(['danmu1', 'danmu2', 'danmu3', '...'])

    return { danmus }
  },
}
</script>
```

## Attributes

| 参数          | 说明                                                 | 类型    | 可选值       | 默认值 |
| :------------ | :--------------------------------------------------- | :------ | :----------- | :----- |
| danmus        | 弹幕元素列表，支持纯文本或者自定义对象(支持 v-model) | Array   | 字符串或对象 | []     |
| channels      | 轨道数量                                             | Number  |              | 0      |
| autoplay      | 是否自动播放                                         | Boolean |              | true   |
| useSlot       | 是否开启弹幕插槽                                     | Boolean |              | false  |
| loop          | 是否开启弹幕循环                                     | Boolean |              | false  |
| fontSize      | 弹幕字号（slot 模式下不可用）                        | Number  |              | 18     |
| extraStyle    | 额外样式（slot 模式下不可用）                        | String  |              |        |
| speeds        | 弹幕速度（每秒移动的像素数）                         | Number  |              | 200    |
| debounce      | 弹幕刷新频率(ms)                                     | Number  |              | 100    |
| randomChannel | 随机选择轨道插入                                     | Boolean |              | false  |
| isSuspend     | 是否开启弹幕悬浮暂停（试验型功能）                   | Boolean |              | false  |
| top           | 弹幕垂直间距(px)                                     | Number  |              | 4      |
| right         | 弹幕水平间距(px)                                     | Number  |              | 0      |

- 注 0：1.0.0 版本起，danmus 参数支持 v-model:danmus 写法变为双向绑定
- 注 1：channels 为 0，则轨道数为容器可容纳最高轨道数
- 注 2：danmus 初始化后如果为空，则 autoplay 失效。因此对于异步加载的弹幕数据，需要手动调用 `refName.value.play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一次弹幕

## 内置方法

通过以下方式调用：

```js
<vue-danmaku ref="danmakuRef"></vue-danmaku>

setup() {
  const danmakuRef = ref(null)

  danmakuRef.value.play()
}
```

| 方法名       | 说明                                         | 参数                           |
| :----------- | :------------------------------------------- | :----------------------------- |
| play         | 开始/继续播放                                | -                              |
| pause        | 暂停弹幕播放                                 | -                              |
| stop         | 停止播放并清空弹幕                           | -                              |
| show         | 弹幕显示                                     | -                              |
| hide         | 弹幕隐藏                                     | -                              |
| reset        | 重置配置                                     | -                              |
| resize       | 容器尺寸改变时重新计算滚动距离（需手动调用） | -                              |
| push         | 发送弹幕（插入到弹幕列表末尾，排队显示）     | danmu 数据，可以是字符串或对象 |
| add          | 发送弹幕（插入到当前播放位置，实时显示）     | danmu 数据，可以是字符串或对象 |
| insert       | 绘制弹幕（实时插入）                         | danmu 数据，可以是字符串或对象 |
| getPlayState | 获得当前播放状态                             |                                |

- 注 1：push 和 add 的返回值为插入后的下标，可通过判断下标的方式对当前插入弹幕进行样式定制
- 注 2：insert 跟 push/add 的区别在于，insert 不进行数据绑定，而是直接插入 DOM，适用于直播等场景

## Events

| 事件名   | 说明                           | 返回值                      |
| :------- | :----------------------------- | :-------------------------- |
| list-end | 所有弹幕插入完毕               | -                           |
| play-end | 所有弹幕播放完成（已滚出屏幕） | index（最后一个弹幕的下标） |

## Slot

如果你有自定义弹幕结构与样式的需求，你可以传入任意结构的对象并自己写内部样式。

```vue
<template>
  <vue-danmaku ref="danmaku" v-model:danmus="danmus" useSlot loop :channels="5">
    <!-- 弹幕插槽 -->
    <template v-slot:dm="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
    </template>
    <!-- 容器插槽 -->
    <div></div>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue3-danmaku'

export default {
  setup(props) {
    const danmus = ref([{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...])

    return { danmus }
  },
}
</script>
```

## 讨论交流和 BUG 反馈

QQ 群：747809274

也可以给本项目[提交 issue](https://github.com/hellodigua/vue-danmaku/issues)

## 注意事项

- 必须给 vue-danmaku 组件设置宽高才能正常使用

## Changelog

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
