# vue-danmaku

> 基于Vue.js的弹幕交互组件

Demo： [https://hellodigua.github.io/vue-danmaku](https://hellodigua.github.io/vue-danmaku)

![normal.jpg](https://i.loli.net/2021/01/17/u1CWvG4A2UVPH6c.jpg)

![slot.jpg](https://i.loli.net/2021/01/17/W6etb1GN9YkJ4Rj.jpg)
## Install

```js
npm install vue-danmaku --save
```

## Usage

```html
<vue-danmaku ref="danmaku" :danmus="danmus" :config="config" @inited="onInit">
  <!-- 容器插槽 -->
  <div slot="content"></div>
</vue-danmaku>
```

```javascript
import vueDanmaku from 'vue-danmaku'

data() {
  return {
    danmus: ['danmu1', 'danmu2', 'danmu3', 'danmu4', '...']
    config: {
      slot: false,
      channels: 5,
      loop: true,
      speed: 5,
      fontSize: 20
    }
  }
}

```

## 自定义弹幕

```html

```html
<vue-danmaku ref="danmaku" :danmus="danmus" :config="config" @inited="onInit">
  <div slot-scope="{danmu, index}">
    <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
  </div>
  <!-- 容器插槽 -->
  <div slot="content"></div>
</vue-danmaku>
```

```javascript
import vueDanmaku from 'vue-danmaku'

data() {
  return {
    danmus: [{ name: 'a', text: 'aaa' }, { name: 'b', text: 'bbb' }, ...]
    config: {
      slot: true,
      channels: 5,
      loop: true,
      speed: 5
    }
  }
}
```

## Attributes

| 参数         | 说明                      | 类型           | 可选值      | 默认值           |
| :----------- | :----------------------- | :------------- | :-------- | :-------------- |
| config     | 弹幕配置                    |    [Object]    |          |  见下表         |
| danmus     | 弹幕元素列表，支持纯文本或者自定义对象    | [Array]    |          |           |

## Config Attributes

| 参数         | 说明                      | 类型           | 可选值                    | 默认值                      |
| :----------- | :----------------------- | :------------- | :----------------------- | :-------------------------- |
| channels     | 轨道数量                  |    [Number]    |                          |  0 容器可容纳最高轨道数         |
| slot         | 是否开启弹幕插槽            |    [Boolean]    |                          |  false         |
| loop         | 是否开启弹幕循环           |    [Boolean]   |                          |  false                      |
| speed        | 弹幕速度（值越大速度越小） |    [Number]    |                          |  10                         |
| fontSize     | 弹幕字号（文本模式可用）     |    [Number]    |                          |  20                         |
| debounce     | 弹幕刷新频率(ms)     |    [Number]    |                          |  50                         |
| top          | 弹幕垂直间距(px)     |    [Number]    |                          |  4                         |
| right        | 弹幕水平间距(px)     |    [Number]    |                          |  2                         |

## Events

| 事件名称             | 说明              | 回调参数              |
| :--------------- | :-------------- | :---------------- |
| inited   | 弹幕初始化完毕，准备就绪| null |

## Methods

| 方法名            | 说明           | 参数             |
| :--------------- | :-------------- | :-------------- |
| play             | 开始弹幕滚动     |                 |
| pause            | 暂停弹幕滚动     |                 |
| stop             | 停止弹幕滚动     |                 |
| setChannels      | 动态设置轨道数    |                 |
| show             | 弹幕显示         |                 |
| hide             | 弹幕隐藏         |                 |
| reset            | 重置为当前设置    |                 |
| add              | 新增弹幕         |                 |

## 进度

- [x] 弹幕暂停 v0.0.5
- [x] 弹幕速度 v0.0.5
- [x] 弹道控制 v0.0.5
- [x] 弹幕循环 v0.0.5
- [x] 弹幕速度 v0.0.6
- [x] 弹幕字号 v0.0.6
- [x] 新增弹幕 v0.0.6
- [x] 支持iOS v0.1.0
- [x] 弹幕插槽 v0.2.0
- [x] 设置弹幕距离 v0.3.0
- [x] Make Core Code Great Again v0.3.0
- [ ] 弹幕操作事件 -> 动工中
- [ ] 随机轨道发送 - > 动工中
- [ ] 顶部弹幕 - > pending
- [ ] 倒放模式 -> pending
- [ ] 时间控制器 - > pending
- [ ] TS类型支持
- [ ] 支持Vue3
