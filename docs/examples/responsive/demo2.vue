<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  '自定义响应式参数',
  '可以设置最小和最大轨道数',
  '这样可以更好地控制弹幕展示效果',
  '适应不同设备尺寸',
  '这是一条测试弹幕',
  '响应式布局示例',
  '弹幕密度可控',
])

// 获取弹幕实例
const danmakuRef = ref()

// 自定义响应式参数
const minChannels = 3 // 最小轨道数
const maxChannels = 10 // 最大轨道数

// 根据容器宽度计算合适的轨道数
const calcChannels = (width) => {
  // 每200px宽度增加一个轨道，但不超过最大轨道数
  const channels = Math.floor(width / 200)
  return Math.max(minChannels, Math.min(channels, maxChannels))
}

onMounted(() => {
  // 初始化时计算轨道数
  const updateChannels = () => {
    if (danmakuRef.value) {
      const container = danmakuRef.value.$el
      const width = container.clientWidth
      danmakuRef.value.setChannels(calcChannels(width))
    }
  }

  // 首次计算
  updateChannels()

  // 监听窗口大小变化
  window.addEventListener('resize', updateChannels)
})
</script>

<template>
  <div style="height: 300px; width: 100%">
    <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="minChannels" loop autoplay>
      <template #dm="{ danmu }">{{ danmu }}</template>
    </vue-danmaku>
  </div>
</template>
