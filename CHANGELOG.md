# 更新日志

## 2.0.4

- fix: 修复 className 判断错误的问题

## v2.0.2

- 新增镜像模式

## v2.0.0

新增：

- 新增 addDanmu 方法，统一弹幕添加接口
- 新增 performanceMode 参数，默认开启性能模式
- 新增 autoResize 参数，默认开启自动监听容器大小变化
- 新增 zIndex 参数，默认 1
- 新增多个事件：dm-click, dm-remove, error

优化：

- 在移除弹幕时清理相关引用
- 移除 useSlot 和文本模式，默认使用 slot 模式

移除：

- 移除以下参数： useSlot、fontSize、extraStyle
- 移除 push 和 add 方法

## v1.6.1

- fix: 修复定时器类型错误

## v1.6.0

- feat: 新增弹幕悬浮暂停相关事件

## v1.5.3

- feat: 初始化时获取不到容器宽高时抛出异常

## v1.5.2

- chore: 压缩打包体积

## v1.5.1

- fix: 修复部分场景下弹幕显示重叠的问题

## v1.4.0

- fix: 修复弹幕过长时后续弹幕不连贯的问题

## v1.3.0

- 更新了文档

## v1.2.0

- 优化 resize 逻辑
- fix: 修复 iOS15 下部分机型的 APP 内置 webview 在弹幕初始化时可能会闪屏的 BUG

## v1.1.0

- feat: 暴露 insert 方法，允许直接外部绘制弹幕

## v1.0.0

- 修复大量遗留 BUG
- 同步 Vue2 版本变更
- 支持 danmus 双向绑定

## v0.2.0

- speed 参数改为 speeds 参数，含义同样发生变化(主要是为了保证不同屏幕下弹幕移动速度相同)
  - speed: 弹幕经过屏幕的总时长
  - speeds: 弹幕每秒走过的像素距离

## v0.1.0

- 支持 vue3
