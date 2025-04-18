# 完整用法

展示 Vue Danmaku 组件的完整功能和配置选项，包括所有可定制的参数和事件。

## 综合示例

这个示例展示了 Vue Danmaku 的大部分功能，包括自定义样式、控制面板、事件处理等。

:::demo
full-usage/demo1
:::

## 所有配置项说明

下表是 Vue Danmaku 组件支持的所有配置选项：

| 参数            | 说明                                                     | 类型    | 默认值 |
| --------------- | -------------------------------------------------------- | ------- | ------ |
| danmus          | 弹幕列表数据                                             | Array   | []     |
| channels        | 轨道数量，0 为最大轨道数量（撑满容器）                   | Number  | 0      |
| autoplay        | 是否自动播放                                             | Boolean | true   |
| loop            | 是否循环播放                                             | Boolean | false  |
| loopOnly        | 循环模式下是否避免重复弹幕                               | Boolean | false  |
| randomChannel   | 是否开启随机轨道注入弹幕                                 | Boolean | false  |
| isSuspend       | 是否开启悬浮暂停                                         | Boolean | false  |
| performanceMode | 性能模式，启用时使用 requestAnimationFrame 代替 CSS 动画 | Boolean | true   |
| debounce        | 弹幕刷新频率(ms)                                         | Number  | 100    |
| speeds          | 弹幕速度（像素/秒）                                      | Number  | 200    |
| top             | 弹幕垂直间距                                             | Number  | 4      |
| right           | 弹幕水平间距                                             | Number  | 0      |
| zIndex          | 弹幕默认层级                                             | Number  | 10     |

## 可用事件

| 事件名    | 说明                   | 回调参数            |
| --------- | ---------------------- | ------------------- |
| list-end  | 弹幕列表播放完毕时触发 | -                   |
| play-end  | 弹幕播放完毕时触发     | -                   |
| dm-over   | 弹幕显示出来时触发     | danmu, index        |
| dm-out    | 弹幕离开屏幕时触发     | danmu, index        |
| dm-click  | 弹幕被点击时触发       | danmu, index, event |
| dm-remove | 弹幕被删除时触发       | danmu, index        |
| error     | 出现错误时触发         | error               |

## 可用方法

| 方法名      | 说明                     | 参数      |
| ----------- | ------------------------ | --------- |
| play        | 开始播放弹幕             | -         |
| pause       | 暂停播放弹幕             | -         |
| show        | 显示弹幕                 | -         |
| hide        | 隐藏弹幕                 | -         |
| clear       | 清空弹幕                 | -         |
| push        | 添加一条弹幕             | danmu     |
| add         | 批量添加弹幕             | danmuList |
| resize      | 重新计算容器尺寸         | -         |
| reset       | 重置弹幕，会清空所有数据 | -         |
| setChannels | 设置轨道数量             | channels  |
| setSpeed    | 设置弹幕速度             | speed     |
