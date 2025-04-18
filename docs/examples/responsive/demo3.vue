<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  '速度响应式弹幕',
  '屏幕越宽弹幕速度越快',
  '这样可以保证弹幕通过的时间基本一致',
  '提供更好的用户体验',
  '调整窗口宽度可以查看效果',
  '这是一条测试弹幕',
  'Vue Danmaku速度响应示例',
])

// 获取弹幕实例
const danmakuRef = ref()

// 基准参数
const baseWidth = 800 // 基准宽度
const baseSpeed = 200 // 基准速度（像素/秒）
const minSpeed = 100 // 最小速度
const maxSpeed = 400 // 最大速度

// 根据容器宽度计算合适的速度
const calcSpeed = (width) => {
  // 速度与宽度成正比，但有最大和最小限制
  const speed = Math.floor(baseSpeed * (width / baseWidth))
  return Math.max(minSpeed, Math.min(speed, maxSpeed))
}

onMounted(() => {
  // 更新速度的函数
  const updateSpeed = () => {
    if (danmakuRef.value) {
      const container = danmakuRef.value.$el
      const width = container.clientWidth
      danmakuRef.value.setSpeed(calcSpeed(width))
    }
  }

  // 首次计算速度
  updateSpeed()

  // 监听窗口大小变化以调整速度
  window.addEventListener('resize', updateSpeed)
})
</script>

<template>
  <div style="height: 300px; width: 100%">
    <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="5" :speeds="baseSpeed" loop autoplay>
      <template #dm="{ danmu }">{{ danmu }}</template>
    </vue-danmaku>

    <div class="speed-info" style="margin-top: 10px; font-size: 14px; color: #666">
      当前基准速度: {{ baseSpeed }} 像素/秒 (容器宽度变化时会自动调整)
    </div>
  </div>
</template>
