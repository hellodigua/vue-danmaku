<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  '悬浮高亮效果演示',
  '将鼠标悬停在弹幕上',
  '弹幕会暂停并高亮显示',
  '增强用户交互体验',
  '这是一条测试弹幕',
  '移开鼠标后恢复正常',
  '这是另一条测试弹幕',
])

// 当前悬停的弹幕索引
const hoverIndex = ref(-1)

// 处理悬停事件
const handleMouseover = (index) => {
  hoverIndex.value = index
}

// 处理鼠标离开事件
const handleMouseout = () => {
  hoverIndex.value = -1
}
</script>

<template>
  <div style="height: 300px">
    <vue-danmaku :danmus="danmus" :channels="6" isSuspend loop autoplay>
      <template #danmu="{ danmu, index }">
        <span
          class="danmu-item"
          :class="{ highlight: index === hoverIndex }"
          @mouseover="handleMouseover(index)"
          @mouseout="handleMouseout"
        >
          {{ danmu }}
        </span>
      </template>
    </vue-danmaku>
  </div>
</template>

<style scoped>
.danmu-item {
  transition: all 0.3s;
  padding: 2px 8px;
  border-radius: 4px;
}

.highlight {
  background-color: rgba(255, 255, 0, 0.3);
  color: #ff5722;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
</style>
