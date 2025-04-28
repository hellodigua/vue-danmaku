<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku, { DanmakuInstance } from 'vue-danmaku'

const _danmus = ['欢迎尝试添加弹幕功能', '在下方输入框输入内容并点击发送', '或者按回车键发送']
const newDanmu = ref('')
const danmakuRef = ref<DanmakuInstance | null>(null)

// 每秒随机发送一条弹幕
setInterval(() => {
  if (danmakuRef.value) {
    danmakuRef.value.insert(_danmus[Math.floor(Math.random() * _danmus.length)])
  }
}, 1000)

const sendDanmu = () => {
  if (newDanmu.value.trim()) {
    // 添加新弹幕到数组
    danmakuRef.value?.insert(newDanmu.value)

    // 如果引用到了组件实例，可以调用组件方法添加单条弹幕
    if (danmakuRef.value) {
      danmakuRef.value.addDanmu(newDanmu.value)
    }

    // 清空输入框
    newDanmu.value = ''
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    sendDanmu()
  }
}
</script>

<template>
  <div class="demo-container">
    <div class="h-200 danmaku-container">
      <VueDanmaku ref="danmakuRef" autoplay random-channel>
        <template #danmu="{ danmu }">
          <div class="danmu-item">
            <span class="content">{{ danmu }}</span>
          </div>
        </template>
      </VueDanmaku>
    </div>
    <div class="input-container">
      <input v-model="newDanmu" type="text" placeholder="输入弹幕内容..." @keydown="handleKeyDown" />
      <button @click="sendDanmu">发送弹幕</button>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.danmaku-container {
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.input-container {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3aa876;
}
</style>
