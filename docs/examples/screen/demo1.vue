<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 会场情景数据
const eventInfo = {
  name: '2023 技术分享大会',
  hashtag: '#TechShare2023',
  attendees: 1247,
  qrcodeUrl: 'https://example.com/qrcode',
}

// 模拟参与者信息
const attendees = [
  { id: 1, name: '张三', avatar: '👨‍💻', city: '北京', role: '开发者' },
  { id: 2, name: '李四', avatar: '👩‍💼', city: '上海', role: '产品经理' },
  { id: 3, name: '王五', avatar: '👨‍🔬', city: '深圳', role: '数据科学家' },
  { id: 4, name: '赵六', avatar: '👩‍🎨', city: '杭州', role: 'UI设计师' },
  { id: 5, name: '钱七', avatar: '👨‍🚀', city: '广州', role: '架构师' },
  { id: 6, name: '孙八', avatar: '👩‍🔧', city: '成都', role: '测试工程师' },
  { id: 7, name: '周九', avatar: '👨‍🏫', city: '武汉', role: '技术讲师' },
  { id: 8, name: '吴十', avatar: '👩‍💻', city: '南京', role: '前端工程师' },
]

// 预设问题和评论
const presetMessages = [
  '这个技术很有前景！',
  '请问如何解决并发问题？',
  '讲得非常精彩！',
  '能否详细介绍一下架构设计？',
  '我们公司也在使用这个技术',
  '如何处理大规模数据？',
  '这个功能太酷了！',
  '请问PPT会分享吗？',
  '希望多讲一些实际案例',
  '有没有考虑安全性问题？',
  '支持！非常实用的技术分享',
  '请问入门门槛高吗？',
  '期待下一次分享！',
]

// 弹幕数据
const danmus = ref([])

// 虚拟观众发送的弹幕
const virtualAttendeeMessages = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 用户输入内容
const userInput = reactive({
  name: '',
  message: '',
  city: '',
  isAnonymous: false,
})

// 弹幕颜色
const messageColors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ff9800', '#795548', '#607d8b', '#e91e63']

// 活动统计
const stats = reactive({
  totalMessages: 0,
  activeUsers: 0,
  populationMap: {},
  topMessage: { user: '', message: '', likes: 0 },
})

// 模拟当前讲师信息
const presenter = {
  name: '张教授',
  topic: '现代Web前端技术趋势',
  organization: '某知名科技公司',
}

// 生成随机弹幕
const generateRandomDanmu = () => {
  const attendee = attendees[Math.floor(Math.random() * attendees.length)]
  const message = presetMessages[Math.floor(Math.random() * presetMessages.length)]
  const color = messageColors[Math.floor(Math.random() * messageColors.length)]

  return {
    id: Date.now(),
    user: attendee.name,
    avatar: attendee.avatar,
    city: attendee.city,
    role: attendee.role,
    message,
    color,
    likes: Math.floor(Math.random() * 20),
    time: new Date().toLocaleTimeString(),
  }
}

// 添加用户弹幕
const addUserDanmu = () => {
  if (!userInput.message) return

  const danmu = {
    id: Date.now(),
    user: userInput.isAnonymous ? '匿名用户' : userInput.name || '访客',
    avatar: '👤',
    city: userInput.city || '未知',
    role: '观众',
    message: userInput.message,
    color: messageColors[Math.floor(Math.random() * messageColors.length)],
    likes: 0,
    time: new Date().toLocaleTimeString(),
    isUser: true,
  }

  danmus.value.push(danmu)
  danmakuRef.value.push(danmu)

  // 更新统计
  updateStats(danmu)

  // 添加到虚拟观众消息
  virtualAttendeeMessages.value.unshift(danmu)
  if (virtualAttendeeMessages.value.length > 10) {
    virtualAttendeeMessages.value.pop()
  }

  // 清空输入
  userInput.message = ''
}

// 发送随机弹幕
let danmuTimer
const sendRandomDanmu = () => {
  const danmu = generateRandomDanmu()

  danmus.value.push(danmu)
  danmakuRef.value.push(danmu)

  // 更新统计
  updateStats(danmu)

  // 添加到虚拟观众消息
  virtualAttendeeMessages.value.unshift(danmu)
  if (virtualAttendeeMessages.value.length > 10) {
    virtualAttendeeMessages.value.pop()
  }
}

// 更新统计信息
const updateStats = (danmu) => {
  stats.totalMessages++

  // 更新活跃用户
  stats.activeUsers = new Set(danmus.value.map((d) => d.user)).size

  // 更新城市分布
  if (!stats.populationMap[danmu.city]) {
    stats.populationMap[danmu.city] = 0
  }
  stats.populationMap[danmu.city]++

  // 更新热门弹幕
  if (danmu.likes > stats.topMessage.likes) {
    stats.topMessage = {
      user: danmu.user,
      message: danmu.message,
      likes: danmu.likes,
    }
  }
}

// 获取排名前三的城市
const getTopCities = computed(() => {
  return Object.entries(stats.populationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([city, count]) => ({ city, count }))
})

// 模拟用户互动
const startRandomDanmus = () => {
  danmuTimer = setInterval(() => {
    // 随机发送弹幕
    if (Math.random() > 0.7) {
      sendRandomDanmu()
    }
  }, 2000)
}

// 点赞弹幕
const likeDanmu = (danmu) => {
  danmu.likes++

  // 更新热门弹幕
  if (danmu.likes > stats.topMessage.likes) {
    stats.topMessage = {
      user: danmu.user,
      message: danmu.message,
      likes: danmu.likes,
    }
  }
}

onMounted(() => {
  // 初始化弹幕组件
  danmakuRef.value.resize()

  // 发送一些初始弹幕
  for (let i = 0; i < 5; i++) {
    sendRandomDanmu()
  }

  // 开始随机弹幕
  startRandomDanmus()
})

onBeforeUnmount(() => {
  if (danmuTimer) {
    clearInterval(danmuTimer)
  }
})
</script>

<template>
  <div class="interactive-screen-container">
    <!-- 大屏幕区域 -->
    <div class="big-screen">
      <!-- 顶部信息栏 -->
      <div class="event-header">
        <div class="event-info">
          <h2 class="event-name">{{ eventInfo.name }}</h2>
          <div class="event-hashtag">{{ eventInfo.hashtag }}</div>
        </div>

        <div class="presenter-info">
          <div class="presenter-topic">《{{ presenter.topic }}》</div>
          <div class="presenter-name">{{ presenter.name }} | {{ presenter.organization }}</div>
        </div>

        <div class="audience-info">
          <div class="audience-count">观众: {{ eventInfo.attendees }}人</div>
          <div class="message-count">互动: {{ stats.totalMessages }}条</div>
        </div>
      </div>

      <!-- 弹幕区域 -->
      <div class="danmaku-screen">
        <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="12" :speeds="150" :debounce="50">
          <template #danmu="{ danmu }">
            <div class="screen-danmu">
              <span class="danmu-avatar">{{ danmu.avatar }}</span>
              <span class="danmu-user">{{ danmu.user }}</span>
              <span class="danmu-city">({{ danmu.city }})</span>
              <span class="danmu-message" :style="{ color: danmu.color }">
                {{ danmu.message }}
              </span>
              <span class="danmu-likes" v-if="danmu.likes > 0"> 👍 {{ danmu.likes }} </span>
            </div>
          </template>
        </vue-danmaku>
      </div>

      <!-- 底部信息栏 -->
      <div class="screen-footer">
        <div class="qrcode-section">
          <div class="qrcode-placeholder">扫码参与互动</div>
          <div class="qrcode-text">微信扫码</div>
          <div class="qrcode-text">发送弹幕到大屏</div>
        </div>

        <div class="stats-section">
          <div class="stats-header">实时数据</div>
          <div class="stats-item">
            <div class="stats-label">参与用户</div>
            <div class="stats-value">{{ stats.activeUsers }}</div>
          </div>
          <div class="stats-item">
            <div class="stats-label">互动消息</div>
            <div class="stats-value">{{ stats.totalMessages }}</div>
          </div>
          <div class="stats-item">
            <div class="stats-label">热门城市</div>
            <div class="stats-cities">
              <span v-for="(city, index) in getTopCities" :key="index" class="city-tag">
                {{ city.city }}
              </span>
            </div>
          </div>
        </div>

        <div class="hot-message">
          <div class="hot-message-header">热门互动</div>
          <div class="hot-message-content" v-if="stats.topMessage.message">
            <span class="hot-user">{{ stats.topMessage.user }}:</span>
            <span class="hot-text">{{ stats.topMessage.message }}</span>
            <span class="hot-likes">👍 {{ stats.topMessage.likes }}</span>
          </div>
          <div class="hot-message-content" v-else>暂无热门互动</div>
        </div>
      </div>
    </div>

    <!-- 交互控制区域 -->
    <div class="interaction-panel">
      <!-- 虚拟观众消息列表 -->
      <div class="attendee-messages">
        <h3>实时互动消息</h3>
        <div class="messages-list">
          <div
            v-for="message in virtualAttendeeMessages"
            :key="message.id"
            class="message-item"
            :class="{ 'user-message': message.isUser }"
          >
            <div class="message-avatar">{{ message.avatar }}</div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-user">{{ message.user }}</span>
                <span class="message-city">{{ message.city }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-text">{{ message.message }}</div>
            </div>
            <div class="message-likes">
              <button class="like-btn" @click="likeDanmu(message)">👍 {{ message.likes }}</button>
            </div>
          </div>

          <div v-if="virtualAttendeeMessages.length === 0" class="no-messages">暂无互动消息</div>
        </div>
      </div>

      <!-- 发送弹幕表单 -->
      <div class="send-panel">
        <h3>发送互动消息</h3>
        <div class="input-form">
          <div class="form-row">
            <input v-model="userInput.name" placeholder="你的昵称（选填）" maxlength="10" />
            <input v-model="userInput.city" placeholder="所在城市（选填）" maxlength="10" />
          </div>

          <div class="form-row message-row">
            <input
              v-model="userInput.message"
              placeholder="输入互动内容..."
              maxlength="50"
              @keyup.enter="addUserDanmu"
            />
            <button @click="addUserDanmu" :disabled="!userInput.message" class="send-btn">发送</button>
          </div>

          <div class="form-row checkbox-row">
            <label>
              <input type="checkbox" v-model="userInput.isAnonymous" />
              <span>匿名发送</span>
            </label>
          </div>
        </div>

        <!-- 预设消息 -->
        <div class="preset-messages">
          <div class="preset-title">快捷消息:</div>
          <div class="preset-list">
            <button
              v-for="(message, index) in presetMessages.slice(0, 5)"
              :key="index"
              @click="userInput.message = message"
              class="preset-btn"
            >
              {{ message }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interactive-screen-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.big-screen {
  position: relative;
  height: 500px;
  background-color: #1a237e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.event-header {
  height: 60px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.event-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.event-hashtag {
  font-size: 14px;
  color: #64b5f6;
}

.presenter-info {
  text-align: center;
}

.presenter-topic {
  font-size: 16px;
  font-weight: bold;
}

.presenter-name {
  font-size: 14px;
  opacity: 0.8;
}

.audience-info {
  text-align: right;
  font-size: 14px;
}

.audience-count,
.message-count {
  opacity: 0.8;
}

.danmaku-screen {
  flex: 1;
  position: relative;
  background: linear-gradient(to bottom, #303f9f, #1a237e);
}

.screen-danmu {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 6px 15px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.danmu-avatar {
  margin-right: 6px;
  font-size: 16px;
}

.danmu-user {
  font-weight: bold;
  margin-right: 4px;
}

.danmu-city {
  font-size: 12px;
  opacity: 0.7;
  margin-right: 8px;
}

.danmu-message {
  font-size: 16px;
}

.danmu-likes {
  margin-left: 8px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
}

.screen-footer {
  height: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-placeholder {
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #333;
  margin-bottom: 4px;
}

.qrcode-text {
  font-size: 12px;
  white-space: nowrap;
}

.stats-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-header {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 12px;
  opacity: 0.8;
}

.stats-value {
  font-weight: bold;
  color: #64b5f6;
}

.stats-cities {
  display: flex;
  gap: 4px;
}

.city-tag {
  font-size: 12px;
  padding: 2px 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.hot-message {
  max-width: 300px;
}

.hot-message-header {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.hot-message-content {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.hot-user {
  font-weight: bold;
  margin-right: 6px;
}

.hot-text {
  opacity: 0.9;
}

.hot-likes {
  margin-left: 8px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
}

.interaction-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.attendee-messages,
.send-panel {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attendee-messages h3,
.send-panel h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.messages-list {
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.message-item.user-message {
  background-color: #e3f2fd;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.message-user {
  font-weight: bold;
  color: #333;
  margin-right: 6px;
}

.message-city {
  font-size: 12px;
  color: #666;
  margin-right: auto;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-text {
  font-size: 14px;
  color: #333;
}

.message-likes {
  display: flex;
  align-items: center;
}

.like-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover {
  background-color: #f5f5f5;
}

.no-messages {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-row input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.message-row {
  margin-top: 5px;
}

.send-btn {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.send-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.checkbox-row {
  margin-top: -5px;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.preset-messages {
  margin-top: 15px;
}

.preset-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 6px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.preset-btn:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .interaction-panel {
    grid-template-columns: 1fr;
  }
}
</style>
