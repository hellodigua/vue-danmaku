<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  '这是一条弹幕',
  '响应式弹幕示例',
  '调整浏览器窗口大小来查看效果',
  '会自动调整轨道数',
  'Vue Danmaku组件',
  '这是另一条测试弹幕',
  '弹幕轨道会根据容器大小自动调整',
  '弹幕内容可以是任意文本',
])
</script>

<template>
  <div style="height: 300px; width: 100%">
    <vue-danmaku :danmus="danmus" :channels="0" loop autoplay>
      <template #danmu="{ danmu }">{{ danmu }}</template>
    </vue-danmaku>
  </div>
</template>
