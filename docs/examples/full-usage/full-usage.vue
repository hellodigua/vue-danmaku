<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 弹幕数据
const danmuList = ref([
  { id: 1, text: 'Vue Danmaku 完整功能演示', color: '#ff5722', size: 20 },
  { id: 2, text: '这是一条自定义样式的弹幕', color: '#2196f3', size: 18 },
  { id: 3, text: '支持自定义弹幕颜色和大小', color: '#4caf50', size: 16 },
  { id: 4, text: '可以控制弹幕速度和轨道数', color: '#ffc107', size: 18 },
  { id: 5, text: '支持弹幕事件处理', color: '#9c27b0', size: 18 },
  { id: 6, text: '可以暂停、继续、隐藏弹幕', color: '#e91e63', size: 16 },
  { id: 7, text: '支持新增和批量添加弹幕', color: '#3f51b5', size: 20 },
  { id: 8, text: '可以设置循环播放', color: '#795548', size: 16 },
  { id: 9, text: '这是最后一条演示弹幕', color: '#607d8b', size: 18 },
])

// 弹幕样式
const danmuStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: 1.5,
  padding: '4px 8px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
}

// 新增弹幕内容和样式
const newDanmu = reactive({
  text: '',
  color: '#ff5722',
  size: 16,
})

// 设置选项
const options = reactive({
  channels: 8,
  speeds: 200,
  loop: true,
  randomChannel: false,
  performanceMode: true,
  isSuspend: true,
})

// 弹幕组件实例
const danmakuRef = ref()

// 事件日志
const eventLogs = ref([])
const maxLogs = 5

// 记录事件
const logEvent = (event, data = {}) => {
  const time = new Date().toLocaleTimeString()
  eventLogs.value.unshift({ time, event, data: JSON.stringify(data) })

  // 限制日志数量
  if (eventLogs.value.length > maxLogs) {
    eventLogs.value = eventLogs.value.slice(0, maxLogs)
  }
}

// 事件处理
const handleDmOver = (danmu, index) => {
  logEvent('dm-over', { danmu, index })
}

const handleDmOut = (danmu, index) => {
  logEvent('dm-out', { danmu, index })
}

const handleDmClick = (danmu, index, event) => {
  logEvent('dm-click', { danmu, index })
}

const handleListEnd = () => {
  logEvent('list-end')
}

// 控制方法
const play = () => {
  danmakuRef.value.play()
  logEvent('play')
}

const pause = () => {
  danmakuRef.value.pause()
  logEvent('pause')
}

const show = () => {
  danmakuRef.value.show()
  logEvent('show')
}

const hide = () => {
  danmakuRef.value.hide()
  logEvent('hide')
}

const stop = () => {
  danmakuRef.value.stop()
  logEvent('stop')
}

const addDanmu = () => {
  if (!newDanmu.text) return

  const id = Date.now()
  danmakuRef.value.push({
    id,
    text: newDanmu.text,
    color: newDanmu.color,
    size: newDanmu.size,
  })

  logEvent('add-danmu', { text: newDanmu.text })
  newDanmu.text = ''
}

const resetDanmu = () => {
  danmakuRef.value.reset()
  logEvent('reset')
}

const updateSettings = () => {
  danmakuRef.value.setChannels(options.channels)
  danmakuRef.value.setSpeed(options.speeds)
  logEvent('update-settings', { channels: options.channels, speeds: options.speeds })
}

// 颜色列表
const colorOptions = ['#ff5722', '#2196f3', '#4caf50', '#ffc107', '#9c27b0', '#e91e63', '#3f51b5', '#795548', '#607d8b']

// 键盘快捷键
const handleKeydown = (e) => {
  if (e.code === 'Space') {
    if (danmakuRef.value) {
      if (paused.value) {
        play()
      } else {
        pause()
      }
    }
    e.preventDefault()
  }
}

const paused = ref(false)
const hidden = ref(false)

// 监听暂停状态变化
watch(
  () => paused.value,
  (newVal) => {
    if (newVal) {
      danmakuRef.value.pause()
    } else {
      danmakuRef.value.play()
    }
  }
)

// 监听显示状态变化
watch(
  () => hidden.value,
  (newVal) => {
    if (newVal) {
      danmakuRef.value.hide()
    } else {
      danmakuRef.value.show()
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="full-usage-demo">
    <!-- 弹幕显示区域 -->
    <div class="danmaku-container">
      <vue-danmaku
        ref="danmakuRef"
        :danmus="danmuList"
        :channels="options.channels"
        :speeds="options.speeds"
        :loop="options.loop"
        :random-channel="options.randomChannel"
        :performance-mode="options.performanceMode"
        :is-suspend="options.isSuspend"
        @dm-over="handleDmOver"
        @dm-out="handleDmOut"
        @dm-click="handleDmClick"
        @list-end="handleListEnd"
      >
        <template #dm="{ danmu }">
          <div
            class="custom-danmu"
            :style="{
              ...danmuStyle,
              color: danmu.color || '#ffffff',
              fontSize: `${danmu.size || 16}px`,
            }"
          >
            {{ danmu.text }}
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h3>弹幕控制</h3>
        <div class="button-group">
          <button @click="play">播放</button>
          <button @click="pause">暂停</button>
          <button @click="show">显示</button>
          <button @click="hide">隐藏</button>
          <button @click="stop">停止播放</button>
          <button @click="resetDanmu">重置设置</button>
        </div>
      </div>

      <div class="panel-section">
        <h3>添加弹幕</h3>
        <div class="form-group">
          <input v-model="newDanmu.text" placeholder="输入弹幕内容" @keyup.enter="addDanmu" />
          <select v-model="newDanmu.color">
            <option v-for="color in colorOptions" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
          <select v-model="newDanmu.size">
            <option :value="14">小</option>
            <option :value="16">中</option>
            <option :value="20">大</option>
          </select>
          <button @click="addDanmu">发送</button>
        </div>
      </div>

      <div class="panel-section">
        <h3>设置选项</h3>
        <div class="form-group">
          <label>
            轨道数量:
            <input v-model.number="options.channels" type="number" min="1" max="20" />
          </label>

          <label>
            弹幕速度:
            <input v-model.number="options.speeds" type="number" min="50" max="500" />
          </label>

          <button @click="updateSettings">应用设置</button>
        </div>

        <div class="checkbox-group">
          <label>
            <input v-model="options.loop" type="checkbox" />
            循环播放
          </label>

          <label>
            <input v-model="options.randomChannel" type="checkbox" />
            随机轨道
          </label>

          <label>
            <input v-model="options.performanceMode" type="checkbox" />
            性能模式
          </label>

          <label>
            <input v-model="options.isSuspend" type="checkbox" />
            悬浮暂停
          </label>
        </div>
      </div>

      <div class="panel-section">
        <h3>事件日志</h3>
        <div class="event-logs">
          <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-event">{{ log.event }}</span>
            <span class="log-data" v-if="log.data !== '{}'">{{ log.data }}</span>
          </div>
          <div v-if="eventLogs.length === 0" class="no-logs">暂无事件日志</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-usage-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.danmaku-container {
  height: 300px;
  background: linear-gradient(to bottom, #333, #222);
  border-radius: 8px;
  overflow: hidden;
}

.custom-danmu {
  cursor: pointer;
  transition: all 0.2s;
}

.custom-danmu:hover {
  transform: scale(1.05);
}

.control-panel {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-group button {
  padding: 6px 12px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button-group button:hover {
  background: #1976d2;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.form-group input,
.form-group select {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group button {
  padding: 6px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-group button:hover {
  background: #388e3c;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #555;
}

.event-logs {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  min-height: 120px;
  max-height: 120px;
  overflow-y: auto;
  font-size: 13px;
}

.log-item {
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px dashed #eee;
}

.log-time {
  color: #888;
  margin-right: 8px;
}

.log-event {
  font-weight: bold;
  color: #2196f3;
  margin-right: 8px;
}

.log-data {
  color: #666;
  font-family: monospace;
  font-size: 12px;
}

.no-logs {
  color: #999;
  text-align: center;
  padding: 10px;
}
</style>
