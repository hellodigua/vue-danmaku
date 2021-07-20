# vue3-danmaku

[![npm-version](https://img.shields.io/npm/v/vue3-danmaku.svg)](https://www.npmjs.com/package/vue3-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue3-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue.js 3.x 的弹幕交互组件

Live Demo： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

## Preview

![1.gif](https://i.loli.net/2021/01/18/AhqP2nZBtLg9uwl.gif)

支持自定义样式和海量弹幕：

![2.gif](https://i.loli.net/2021/01/18/Rn3rHJeoAEsbiwZ.gif)

## Install

```bash
$ npm install vue3-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku :danmus="danmus"></vue-danmaku>
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
- 注 2：danmus 初始化后如果为空，则 autoplay 失效。因此对于异步加载的弹幕数据，需要手动调用 `play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一次弹幕

## 内置方法

通过以下方式调用：

```js
<vue-danmaku ref="danmaku"></vue-danmaku>

setup() {
  const danmaku = ref<any>(null)

  danmaku.value.play()
}
```

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
| push        | 发送弹幕（插入到弹幕列表末尾）               | danmu 数据，可以是字符串或对象 |
| add         | 发送弹幕（插入到当前播放的位置）             | danmu 数据，可以是字符串或对象 |

- 注 1： push 适用于非循环模式，add 适用于循环模式

## Slot

```vue
<template>
  <vue-danmaku ref="danmaku" :danmus="danmus" useSlot loop :channels="5">
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

## Changelog

### v0.2.0

- speed 参数改为 speeds 参数，含义同样发生变化(主要是为了保证不同屏幕下弹幕移动速度相同)
  - speed: 弹幕经过屏幕的总时长
  - speeds: 弹幕每秒走过的像素距离

### v0.1.0

- 支持 vue3
