---
layout: home

title: Vue Danmaku
titleTemplate: 基于Vue3的弹幕交互组件

hero:
  name: Vue Danmaku
  text: 基于Vue3的弹幕交互组件
  tagline: 高性能、易扩展、轻量级的弹幕组件
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/quick-start.html
    - theme: alt
      text: 查看GitHub
      link: https://github.com/hellodigua/vue-danmaku

features:
  - title: 🌈 高性能渲染
    details: 优化的动画实现，支持海量弹幕平滑展示，支持性能监控
  - title: 🎆 简洁易用
    details: 简单的API接口，灵活的插槽机制，轻松实现自定义弹幕样式
  - title: 🍭 响应式兼容
    details: 移动端和PC端兼容，支持多种设备
  - title: 😋 TypeScript支持
    details: 完整的类型定义，提供类型安全和更好的开发体验
---

<script setup lang="ts">
import { ref, onMounted, h, createApp } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref(['这是一条自定义样式的弹幕', '可以设置不同的颜色和样式', '弹幕速度也可以调整'])
let danmakuInstance = null

onMounted(() => {
  // 创建弹幕应用实例
  const app = document.createElement('div')
  app.style.cssText = 'width: 500px; height: 500px; position: fixed; z-index: 0; left: 20%; top: 20%; pointer-events: none;'
  document.querySelector('.VPHome')?.appendChild(app)

  // 使用createApp挂载弹幕组件
  danmakuInstance = createApp({
    setup() {
      return () => h(VueDanmaku, {
        danmus: danmus.value,
        loop: true,
        speeds: 150,
        channels: 0,  // 自动填满容器
        randomChannel: true,
      }, {
        // 使用插槽定义弹幕内容
        dm: ({danmu, index}) => h('div', {
          style: {
            padding: '4px 8px',
            backgroundColor: 'rgba(54, 54, 54, 0.7)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px'
          }
        }, danmu)
      })
    }
  })

  // danmakuInstance.mount(app)
})

</script>
