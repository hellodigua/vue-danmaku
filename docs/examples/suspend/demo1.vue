<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  '将鼠标悬停在弹幕上，弹幕会自动暂停',
  '这是悬浮暂停功能演示',
  '方便用户查看弹幕内容',
  '提升用户体验',
  '这是一条测试弹幕',
  '移开鼠标后弹幕会继续播放',
  '这是另一条测试弹幕',
])
</script>

<template>
  <div style="height: 300px">
    <vue-danmaku :danmus="danmus" :channels="6" isSuspend loop autoplay>
      <template #dm="{ danmu }">{{ danmu }}</template>
    </vue-danmaku>
  </div>
</template>
