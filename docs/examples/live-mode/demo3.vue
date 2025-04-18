<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 弹幕数据
const danmus = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 新增弹幕内容
const newDanmu = ref('')

// 用户昵称（随机生成）
const userNames = [
  '观众A',
  '观众B',
  '观众C',
  '观众D',
  '观众E',
  '用户1',
  '用户2',
  '用户3',
  '用户4',
  '用户5',
  '游客甲',
  '游客乙',
  '游客丙',
  '游客丁',
  '游客戊',
]

// 常用弹幕内容
const commonMessages = [
  '6666666',
  '厉害了',
  '前方高能',
  '哈哈哈哈',
  '学到了',
  '支持',
  '主播好',
  '这个知识点很重要',
  '感谢分享',
  '点赞了',
  '收藏了',
  '转发了',
]

// 弹幕统计数据
const stats = reactive({
  // 总弹幕数
  total: 0,

  // 最近一分钟弹幕数
  recentMinute: 0,

  // 弹幕峰值（每分钟最高）
  peakPerMinute: 0,

  // 弹幕热度（计算方式：近一分钟弹幕数 * 10 + 总弹幕数）
  heat: computed(() => stats.recentMinute * 10 + stats.total),

  // 关键词统计
  keywords: {},

  // 最近一分钟的弹幕时间戳
  recentTimestamps: [],

  // 直播开始时间
  startTime: new Date(),

  // 直播时长（秒）
  duration: 0,
})

// 更新统计信息
const updateStats = (content) => {
  // 更新总数
  stats.total++

  // 记录时间戳用于计算最近一分钟的数量
  const now = Date.now()
  stats.recentTimestamps.push(now)

  // 只保留最近一分钟的时间戳
  const oneMinuteAgo = now - 60000
  stats.recentTimestamps = stats.recentTimestamps.filter((time) => time > oneMinuteAgo)

  // 更新最近一分钟的弹幕数
  stats.recentMinute = stats.recentTimestamps.length

  // 更新峰值
  if (stats.recentMinute > stats.peakPerMinute) {
    stats.peakPerMinute = stats.recentMinute
  }

  // 更新关键词统计
  const words = content.split(/\s+/).filter((word) => word.length > 1)
  words.forEach((word) => {
    if (!stats.keywords[word]) {
      stats.keywords[word] = 0
    }
    stats.keywords[word]++
  })
}

// 获取热门关键词（前5个）
const getHotKeywords = computed(() => {
  return Object.entries(stats.keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))
})

// 添加弹幕
const addDanmu = () => {
  if (!newDanmu.value) return

  const userName = userNames[Math.floor(Math.random() * userNames.length)]

  const danmu = {
    id: Date.now(),
    userName,
    content: newDanmu.value,
    time: new Date().toLocaleTimeString(),
  }

  danmus.value.push(danmu)

  // 发送到弹幕组件
  danmakuRef.value.push(danmu)

  // 更新统计
  updateStats(newDanmu.value)

  // 清空输入框
  newDanmu.value = ''
}

// 随机发送弹幕（模拟）
let danmuTimer
const sendRandomDanmu = () => {
  const userName = userNames[Math.floor(Math.random() * userNames.length)]
  const content = commonMessages[Math.floor(Math.random() * commonMessages.length)]

  const danmu = {
    id: Date.now(),
    userName,
    content,
    time: new Date().toLocaleTimeString(),
  }

  danmus.value.push(danmu)

  // 发送到弹幕组件
  danmakuRef.value.push(danmu)

  // 更新统计
  updateStats(content)
}

// 自动发送随机弹幕
const startRandomDanmus = () => {
  // 清除旧的定时器
  if (danmuTimer) {
    clearInterval(danmuTimer)
  }

  // 设置新的定时器
  danmuTimer = setInterval(() => {
    // 根据当前热度决定发送频率
    const probability = Math.min(0.8, 0.2 + stats.heat / 1000)

    if (Math.random() < probability) {
      sendRandomDanmu()
    }
  }, 1000)
}

// 更新直播时长
let durationTimer
const updateDuration = () => {
  const now = new Date()
  stats.duration = Math.floor((now.getTime() - stats.startTime.getTime()) / 1000)
}

// 格式化时长
const formatDuration = computed(() => {
  const hours = Math.floor(stats.duration / 3600)
  const minutes = Math.floor((stats.duration % 3600) / 60)
  const seconds = stats.duration % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
})

// 获取热度等级
const heatLevel = computed(() => {
  if (stats.heat < 50) return { level: '冷清', color: '#9e9e9e' }
  if (stats.heat < 100) return { level: '一般', color: '#2196f3' }
  if (stats.heat < 200) return { level: '热门', color: '#ff9800' }
  if (stats.heat < 500) return { level: '火爆', color: '#f44336' }
  return { level: '爆炸', color: '#9c27b0' }
})

onMounted(() => {
  // 开始随机弹幕
  startRandomDanmus()

  // 开始计时
  durationTimer = setInterval(updateDuration, 1000)

  // 初始发送一些弹幕
  for (let i = 0; i < 10; i++) {
    sendRandomDanmu()
  }
})

onBeforeUnmount(() => {
  if (danmuTimer) {
    clearInterval(danmuTimer)
  }

  if (durationTimer) {
    clearInterval(durationTimer)
  }
})
</script>

<template>
  <div class="stats-demo-container">
    <!-- 弹幕显示区域 -->
    <div class="video-container">
      <div class="video-placeholder">
        <div class="video-text">直播内容区域</div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="danmus" :channels="10" :speeds="150" :debounce="50" class="danmaku-layer">
        <template #dm="{ danmu }">
          <div class="stats-danmu">
            <span class="user-name">{{ danmu.userName }}:</span>
            <span class="danmu-content">{{ danmu.content }}</span>
          </div>
        </template>
      </vue-danmaku>

      <!-- 统计信息浮层 -->
      <div class="stats-overlay">
        <div class="stats-header">
          <div class="stats-title">弹幕统计</div>
          <div class="live-time">直播时长: {{ formatDuration }}</div>
        </div>

        <div class="stats-row">
          <div class="stats-item">
            <div class="stats-label">总弹幕数</div>
            <div class="stats-value">{{ stats.total }}</div>
          </div>

          <div class="stats-item">
            <div class="stats-label">每分钟弹幕</div>
            <div class="stats-value">{{ stats.recentMinute }}</div>
          </div>

          <div class="stats-item">
            <div class="stats-label">峰值</div>
            <div class="stats-value">{{ stats.peakPerMinute }}/分钟</div>
          </div>

          <div class="stats-item">
            <div class="stats-label">热度</div>
            <div class="stats-value heat" :style="{ color: heatLevel.color }">
              {{ stats.heat }} ({{ heatLevel.level }})
            </div>
          </div>
        </div>

        <div class="hot-keywords">
          <div class="keywords-title">热门词汇:</div>
          <div class="keywords-list">
            <div
              v-for="(keyword, index) in getHotKeywords"
              :key="index"
              class="keyword-item"
              :style="{
                fontSize: `${Math.min(16, 12 + keyword.count / 2)}px`,
                opacity: 1 - index * 0.15,
              }"
            >
              {{ keyword.word }} ({{ keyword.count }})
            </div>
            <div v-if="getHotKeywords.length === 0" class="no-keywords">暂无热门词汇</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹幕输入区域 -->
    <div class="input-area">
      <input v-model="newDanmu" placeholder="发送弹幕..." @keyup.enter="addDanmu" />
      <button @click="addDanmu">发送</button>
    </div>

    <!-- 弹幕活跃度图表 -->
    <div class="activity-chart">
      <div class="chart-title">弹幕活跃度</div>
      <div class="chart-container">
        <div
          class="activity-bar"
          :style="{ height: `${Math.min(100, (stats.recentMinute / stats.peakPerMinute || 0) * 100)}%` }"
        >
          <div class="bar-value">{{ stats.recentMinute }}</div>
        </div>
        <div class="chart-label">实时</div>
      </div>
      <div class="chart-container">
        <div class="activity-bar peak" style="height: 100%">
          <div class="bar-value">{{ stats.peakPerMinute }}</div>
        </div>
        <div class="chart-label">峰值</div>
      </div>
      <div class="chart-container">
        <div
          class="activity-bar heat"
          :style="{
            height: `${Math.min(100, (stats.heat / 500) * 100)}%`,
            backgroundColor: heatLevel.color,
          }"
        >
          <div class="bar-value">{{ stats.heat }}</div>
        </div>
        <div class="chart-label">热度</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-demo-container {
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

.stats-danmu {
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 10px;
  color: white;
  max-width: 300px;
}

.user-name {
  font-weight: bold;
  color: #64b5f6;
  font-size: 14px;
  margin-right: 6px;
}

.danmu-content {
  font-size: 14px;
}

.stats-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 10px;
  width: 280px;
  color: white;
  font-size: 14px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-title {
  font-weight: bold;
  font-size: 16px;
  color: #fff;
}

.live-time {
  font-size: 12px;
  color: #bbb;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.stats-item {
  flex: 1;
  min-width: calc(50% - 4px);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px;
  text-align: center;
}

.stats-label {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 2px;
}

.stats-value {
  font-weight: bold;
  font-size: 16px;
  color: #fff;
}

.stats-value.heat {
  font-size: 14px;
}

.hot-keywords {
  margin-top: 8px;
}

.keywords-title {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 6px;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-item {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
}

.no-keywords {
  color: #999;
  font-size: 12px;
  font-style: italic;
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

.input-area button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.input-area button:hover {
  background-color: #1565c0;
}

.activity-chart {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  height: 150px;
}

.chart-title {
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 14px;
  color: #666;
}

.chart-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.activity-bar {
  width: 40px;
  background-color: #2196f3;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: height 0.3s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.activity-bar.peak {
  background-color: #ff9800;
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.chart-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
