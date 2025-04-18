<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 用户角色定义
const roles = {
  broadcaster: {
    name: '主播',
    color: '#ff5722',
    icon: '🎬',
    badge: '主播',
  },
  admin: {
    name: '管理员',
    color: '#2196f3',
    icon: '🛡️',
    badge: '管理',
  },
  vip: {
    name: 'VIP会员',
    color: '#9c27b0',
    icon: '💎',
    badge: 'VIP',
  },
  member: {
    name: '普通会员',
    color: '#4caf50',
    icon: '🌟',
    badge: '会员',
  },
  guest: {
    name: '游客',
    color: '#9e9e9e',
    icon: '👤',
    badge: '',
  },
}

// 用户列表
const users = [
  { id: 1, name: '直播间主播', role: roles.broadcaster, avatar: '👨' },
  { id: 2, name: '超管小王', role: roles.admin, avatar: '👩' },
  { id: 3, name: 'VIP用户1', role: roles.vip, avatar: '👦' },
  { id: 4, name: 'VIP用户2', role: roles.vip, avatar: '👧' },
  { id: 5, name: '会员用户1', role: roles.member, avatar: '👴' },
  { id: 6, name: '会员用户2', role: roles.member, avatar: '👵' },
  { id: 7, name: '游客1', role: roles.guest, avatar: '🧑' },
  { id: 8, name: '游客2', role: roles.guest, avatar: '👶' },
]

// 预设弹幕内容
const presetMessages = {
  broadcaster: ['欢迎来到直播间', '谢谢大家的支持', '别忘了点赞关注', '今天我们来讲...'],
  admin: ['请大家文明发言', '禁止刷屏', '有问题可以@我', '欢迎新朋友'],
  vip: ['主播真厉害', '学到了很多', '支持支持', '666666'],
  member: ['主播好', '学习了', '感谢分享', '有道理'],
  guest: ['第一次来', '怎么成为会员', '学到了', '6666'],
}

// 弹幕数据
const danmus = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 当前用户（模拟切换身份）
const currentUserIndex = ref(0)
const currentUser = ref(users[0])

// 新增弹幕内容
const newDanmu = ref('')

// 切换用户
const switchUser = () => {
  currentUserIndex.value = (currentUserIndex.value + 1) % users.length
  currentUser.value = users[currentUserIndex.value]
}

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
}

// 随机发送弹幕（模拟直播间其他用户）
let timer
const sendRandomDanmu = () => {
  // 随机选择一个用户
  const user = users[Math.floor(Math.random() * users.length)]

  // 根据用户角色选择消息
  const userMessages = presetMessages[user.role.name.toLowerCase()] || presetMessages.guest
  const content = userMessages[Math.floor(Math.random() * userMessages.length)]

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
  }, 2500)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="identity-demo-container">
    <!-- 直播画面区域（模拟） -->
    <div class="video-container">
      <div class="video-placeholder">
        <div class="video-text">直播内容区域</div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="8" :speeds="150" :debounce="50" class="danmaku-layer">
        <template #dm="{ danmu }">
          <div class="identity-danmu">
            <!-- 角色标识 -->
            <span v-if="danmu.user.role.badge" class="role-badge" :style="{ backgroundColor: danmu.user.role.color }">
              {{ danmu.user.role.badge }}
            </span>

            <!-- 用户头像和名称 -->
            <span class="user-info">
              <span class="user-avatar">{{ danmu.user.role.icon }} {{ danmu.user.avatar }}</span>
              <span class="user-name" :style="{ color: danmu.user.role.color }"> {{ danmu.user.name }}: </span>
            </span>

            <!-- 弹幕内容 -->
            <span class="danmu-content">{{ danmu.content }}</span>
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 当前用户和发送区域 -->
    <div class="control-area">
      <div class="current-user-area">
        <div class="current-user-info">
          <span
            class="role-badge"
            :style="{ backgroundColor: currentUser.value.role.color }"
            v-if="currentUser.value.role.badge"
          >
            {{ currentUser.value.role.badge }}
          </span>

          <span class="user-avatar"> {{ currentUser.value.role.icon }} {{ currentUser.value.avatar }} </span>

          <span class="user-name" :style="{ color: currentUser.value.role.color }">
            {{ currentUser.value.name }}
          </span>
        </div>

        <button @click="switchUser" class="switch-user-btn">切换身份</button>
      </div>

      <div class="input-area">
        <input v-model="newDanmu" placeholder="发送弹幕..." @keyup.enter="addDanmu" />
        <button @click="addDanmu" class="send-btn" :style="{ backgroundColor: currentUser.value.role.color }">
          发送
        </button>
      </div>
    </div>

    <!-- 快捷弹幕 -->
    <div class="preset-area">
      <div class="preset-title">快捷弹幕:</div>
      <div class="preset-list">
        <template v-if="currentUser.value.role.name.toLowerCase() in presetMessages">
          <button
            v-for="message in presetMessages[currentUser.value.role.name.toLowerCase()]"
            :key="message"
            @click="usePresetMessage(message)"
            class="preset-btn"
            :style="{ borderColor: currentUser.value.role.color }"
          >
            {{ message }}
          </button>
        </template>
        <template v-else>
          <button
            v-for="message in presetMessages.guest"
            :key="message"
            @click="usePresetMessage(message)"
            class="preset-btn"
          >
            {{ message }}
          </button>
        </template>
      </div>
    </div>

    <!-- 用户说明 -->
    <div class="user-legend">
      <div class="legend-title">身份说明:</div>
      <div class="legend-items">
        <div v-for="role in Object.values(roles)" :key="role.name" class="legend-item">
          <span v-if="role.badge" class="role-badge small" :style="{ backgroundColor: role.color }">
            {{ role.badge }}
          </span>
          <span class="role-icon">{{ role.icon }}</span>
          <span class="role-name" :style="{ color: role.color }">
            {{ role.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.identity-demo-container {
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

.identity-danmu {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 12px;
  color: white;
  max-width: 350px;
  pointer-events: auto;
}

.role-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  margin-right: 6px;
}

.role-badge.small {
  font-size: 10px;
  padding: 1px 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 6px;
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.user-name {
  font-weight: bold;
  font-size: 14px;
}

.danmu-content {
  font-size: 14px;
  word-break: break-word;
}

.control-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.current-user-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
}

.current-user-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.switch-user-btn {
  padding: 6px 12px;
  background-color: #757575;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.input-area {
  display: flex;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.send-btn {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.send-btn:hover {
  opacity: 0.9;
}

.preset-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preset-title {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
}

.preset-btn:hover {
  background-color: #e0e0e0;
}

.user-legend {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 8px;
}

.legend-title {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
  white-space: nowrap;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.role-icon {
  font-size: 14px;
}

.role-name {
  font-size: 12px;
  font-weight: bold;
}
</style>
