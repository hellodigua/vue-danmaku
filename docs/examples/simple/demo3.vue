<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref([
  { id: 1, avatar: '👨‍💻', username: '用户1', content: '这是自定义弹幕内容' },
  { id: 2, avatar: '👩‍🎨', username: '用户2', content: '可以添加头像和用户名' },
  { id: 3, avatar: '🤖', username: '机器人', content: '支持复杂内容和样式' },
])
</script>

<template>
  <div style="height: 300px">
    <VueDanmaku :danmus="danmus" :fontSize="20" :channels="4" :autoplay="true" :useSlot="true">
      <template #dm="{ danmu }">
        <div class="custom-danmaku">
          <span class="avatar">{{ danmu.avatar }}</span>
          <span class="username">{{ danmu.username }}:</span>
          <span class="content">{{ danmu.content }}</span>
        </div>
      </template>
    </VueDanmaku>
  </div>
</template>

<style scoped>
.custom-danmaku {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 4px 8px;
}

.avatar {
  margin-right: 5px;
  font-size: 1.2em;
}

.username {
  font-weight: bold;
  color: #42b983;
  margin-right: 5px;
}

.content {
  color: white;
}
</style>
