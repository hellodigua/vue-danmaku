<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 用户列表（模拟在线用户）
const users = [
  { name: '用户1', avatar: '👨' },
  { name: '用户2', avatar: '👩' },
  { name: '用户3', avatar: '👦' },
  { name: '用户4', avatar: '👧' },
  { name: '用户5', avatar: '👴' },
  { name: '用户6', avatar: '👵' },
]

// 预设弹幕内容
const presetMessages = [
  '主播好厉害！',
  '这个操作太秀了',
  '6666666',
  '学到了学到了',
  '前方高能',
  '哈哈哈哈',
  '支持主播',
  '这波操作很秀',
  '厉害了我的哥',
  '主播带带我',
]

// 弹幕数据
const danmus = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 新增弹幕内容
const newDanmu = ref('')
const currentUser = ref(users[0])

// 添加弹幕
const addDanmu = () => {
  if (!newDanmu.value) return

  const danmu = {
    id: Date.now(),
    user: currentUser.value,
    content: newDanmu.value,
    time: new Date().toLocaleTimeString(),
  }

  danmus.value.push(danmu)

  // 发送到弹幕组件
  danmakuRef.value.push(danmu)

  // 清空输入框
  newDanmu.value = ''

  // 随机切换用户（模拟多人发言）
  currentUser.value = users[Math.floor(Math.random() * users.length)]
}

// 随机发送弹幕（模拟直播间其他用户）
let timer
const sendRandomDanmu = () => {
  // 随机选择用户和消息
  const user = users[Math.floor(Math.random() * users.length)]
  const content = presetMessages[Math.floor(Math.random() * presetMessages.length)]

  const danmu = {
    id: Date.now(),
    user,
    content,
    time: new Date().toLocaleTimeString(),
  }

  danmus.value.push(danmu)

  // 发送到弹幕组件
  danmakuRef.value.push(danmu)
}

// 使用预设弹幕
const usePresetMessage = (message) => {
  newDanmu.value = message
}

onMounted(() => {
  // 模拟其他用户随机发送弹幕
  timer = setInterval(() => {
    // 随机时间间隔，模拟真实直播间
    if (Math.random() > 0.7) {
      sendRandomDanmu()
    }
  }, 2000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="live-mode-container">
    <!-- 直播画面区域（模拟） -->
    <div class="video-container">
      <div class="video-placeholder">
        <div class="video-text">直播内容区域</div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="8" :speeds="150" :debounce="50" class="danmaku-layer">
        <template #danmu="{ danmu }">
          <div class="live-danmu">
            <span class="user-avatar">{{ danmu.user.avatar }}</span>
            <span class="user-name">{{ danmu.user.name }}:</span>
            <span class="danmu-content">{{ danmu.content }}</span>
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 弹幕发送区域 -->
    <div class="input-area">
      <div class="user-selector">
        <span class="current-user"> {{ currentUser.avatar }} {{ currentUser.name }} </span>
      </div>

      <div class="input-wrapper">
        <input v-model="newDanmu" placeholder="发送弹幕..." @keyup.enter="addDanmu" />
        <button @click="addDanmu">发送</button>
      </div>
    </div>

    <!-- 快捷弹幕 -->
    <div class="preset-messages">
      <div class="preset-title">快捷弹幕:</div>
      <div class="preset-list">
        <button
          v-for="message in presetMessages.slice(0, 5)"
          :key="message"
          @click="usePresetMessage(message)"
          class="preset-btn"
        >
          {{ message }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-mode-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.video-container {
  position: relative;
  height: 350px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-text {
  color: #555;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 8px;
}

.danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.live-danmu {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 12px;
  color: white;
  max-width: 300px;
  pointer-events: auto;
}

.user-avatar {
  margin-right: 4px;
  font-size: 16px;
}

.user-name {
  font-weight: bold;
  margin-right: 6px;
  color: #64b5f6;
  font-size: 14px;
}

.danmu-content {
  font-size: 14px;
  word-break: break-word;
}

.input-area {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-selector {
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  min-width: 100px;
  text-align: center;
}

.current-user {
  font-size: 14px;
  font-weight: bold;
}

.input-wrapper {
  flex: 1;
  display: flex;
  gap: 8px;
}

.input-wrapper input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-wrapper button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.input-wrapper button:hover {
  background-color: #1565c0;
}

.preset-messages {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preset-title {
  font-size: 14px;
  color: #666;
}

.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 4px 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #555;
}

.preset-btn:hover {
  background-color: #e0e0e0;
}
</style>
