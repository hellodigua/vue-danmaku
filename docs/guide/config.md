# 配置项

vue-danmaku 提供了丰富的功能配置，让你可以根据需求自定义弹幕效果。

## 属性

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

## 方法

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
| getPlayState()            | 获得当前播放状态                             | -                                                                                         |

## 事件

| 事件名    | 说明                                           | 返回值                      |
| :-------- | :--------------------------------------------- | :-------------------------- |
| list-end  | 所有弹幕插入完毕                               | -                           |
| play-end  | 所有弹幕播放完成（已滚出屏幕）                 | index（最后一个弹幕的下标） |
| dm-over   | 开启弹幕悬浮暂停时，当进入弹幕，暂停时触发     | 触发的弹幕对象元素          |
| dm-out    | 开启弹幕悬浮暂停时，当离开弹幕，恢复滚动时触发 | 触发的弹幕对象元素          |
| dm-click  | 弹幕被点击时触发                               | '{el, index, danmu, event}' |
| dm-remove | 弹幕被移除时触发                               | '{el, index, danmu}'        |
| error     | 发生错误时触发                                 | '{message, code}'           |

## 实际使用

使用组件实例方法控制弹幕的播放状态。

```vue
<template>
  <div>
    <vue-danmaku ref="danmakuRef" v-model:danmus="danmus" style="height: 200px;">
      <template #danmu="{ danmu, index }">
        <div class="danmu-item">
          {{ danmu }}
        </div>
      </template>
    </vue-danmaku>

    <div class="controls">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="stop">停止</button>
      <button @click="show">显示</button>
      <button @click="hide">隐藏</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import vueDanmaku from 'vue-danmaku'

const danmakuRef = ref(null)
const danmus = ref(['控制示例弹幕1', '控制示例弹幕2', '控制示例弹幕3'])

const play = () => danmakuRef.value.play()
const pause = () => danmakuRef.value.pause()
const stop = () => danmakuRef.value.stop()
const show = () => danmakuRef.value.show()
const hide = () => danmakuRef.value.hide()
const reset = () => danmakuRef.value.reset()
</script>
```
