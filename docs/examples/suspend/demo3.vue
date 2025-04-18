<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  { id: 1, text: '自定义悬浮行为示例', likes: 0 },
  { id: 2, text: '可以悬停在弹幕上互动', likes: 0 },
  { id: 3, text: '比如点赞、回复等操作', likes: 0 },
  { id: 4, text: '增强用户互动性', likes: 0 },
  { id: 5, text: '这是一条测试弹幕', likes: 0 },
  { id: 6, text: '提升用户体验', likes: 0 },
  { id: 7, text: '这是另一条测试弹幕', likes: 0 },
])

// 当前显示操作菜单的弹幕ID
const activeId = ref(null)

// 处理悬停事件
const handleMouseover = (id) => {
  activeId.value = id
}

// 处理鼠标离开事件
const handleMouseout = () => {
  activeId.value = null
}

// 点赞功能
const like = (danmu) => {
  danmu.likes++
}
</script>

<template>
  <div style="height: 300px">
    <vue-danmaku :danmus="danmus" :channels="6" isSuspend loop autoplay>
      <template #dm="{ danmu }">
        <div class="danmu-container" @mouseover="handleMouseover(danmu.id)" @mouseout="handleMouseout">
          <span class="danmu-text">{{ danmu.text }}</span>

          <div v-if="activeId === danmu.id" class="danmu-actions">
            <button class="like-btn" @click.stop="like(danmu)" title="点赞">👍 {{ danmu.likes }}</button>
          </div>
        </div>
      </template>
    </vue-danmaku>
  </div>
</template>

<style scoped>
.danmu-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.7);
}

.danmu-text {
  margin-right: 8px;
}

.danmu-actions {
  display: flex;
  align-items: center;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #ff5722;
  padding: 0 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.like-btn:hover {
  background-color: rgba(255, 87, 34, 0.1);
}
</style>
