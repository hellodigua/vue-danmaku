<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 视频时间轴弹幕数据
const timelineDanmus = [
  { id: 1, time: 2, text: '视频开始了，大家好', user: '用户1', color: '#ff5722' },
  { id: 2, time: 4, text: '这是时间轴弹幕演示', user: '用户2', color: '#2196f3' },
  { id: 3, time: 7, text: '弹幕会在指定时间点显示', user: '用户3', color: '#4caf50' },
  { id: 4, time: 10, text: '就像看视频时的弹幕一样', user: '用户4', color: '#9c27b0' },
  { id: 5, time: 12, text: '可以添加自己的弹幕', user: '用户5', color: '#ff9800' },
  { id: 6, time: 14, text: '适合视频讲解等场景', user: '用户6', color: '#795548' },
  { id: 7, time: 16, text: '弹幕内容可以有不同颜色', user: '用户7', color: '#607d8b' },
  { id: 8, time: 18, text: '这是最后一条预设弹幕', user: '用户8', color: '#e91e63' },
]

// 当前播放的弹幕
const activeDanmus = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 视频控制
const videoStatus = reactive({
  playing: false,
  currentTime: 0,
  duration: 30, // 视频总时长(秒)
})

// 用户添加的弹幕
const userDanmus = ref([])

// 新弹幕内容
const newDanmu = ref('')

// 自定义弹幕颜色
const danmuColor = ref('#ffffff')

// 播放定时器
let playTimer

// 开始播放
const play = () => {
  if (videoStatus.playing) return

  videoStatus.playing = true

  // 启动定时器模拟视频播放
  playTimer = setInterval(() => {
    if (videoStatus.currentTime < videoStatus.duration) {
      videoStatus.currentTime += 0.1
      checkTimelineDanmus()
    } else {
      pause()
      videoStatus.currentTime = 0
    }
  }, 100)
}

// 暂停播放
const pause = () => {
  videoStatus.playing = false
  clearInterval(playTimer)
}

// 重新开始
const restart = () => {
  pause()
  videoStatus.currentTime = 0
  activeDanmus.value = []
  danmakuRef.value.clear()
  play()
}

// 跳转到指定时间
const seekTo = (time) => {
  videoStatus.currentTime = time
  if (videoStatus.playing) {
    checkTimelineDanmus()
  }
}

// 检查并显示时间轴弹幕
const checkTimelineDanmus = () => {
  // 检查是否有弹幕需要在当前时间显示
  const currentTime = Math.floor(videoStatus.currentTime)

  timelineDanmus.forEach((danmu) => {
    if (danmu.time === currentTime && !activeDanmus.value.includes(danmu.id)) {
      // 添加到已显示弹幕列表
      activeDanmus.value.push(danmu.id)

      // 发送到弹幕组件
      danmakuRef.value.push(danmu)
    }
  })
}

// 添加用户弹幕
const addUserDanmu = () => {
  if (!newDanmu.value) return

  const danmu = {
    id: Date.now(),
    time: Math.floor(videoStatus.currentTime),
    text: newDanmu.value,
    user: '我',
    color: danmuColor.value,
  }

  // 添加到用户弹幕列表
  userDanmus.value.push(danmu)

  // 立即显示
  danmakuRef.value.push(danmu)

  // 清空输入
  newDanmu.value = ''
}

// 预设颜色列表
const colorOptions = ['#ffffff', '#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ff9800', '#795548', '#607d8b', '#e91e63']

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  // 初始显示弹幕组件
  danmakuRef.value.resize()
})

onBeforeUnmount(() => {
  if (playTimer) {
    clearInterval(playTimer)
  }
})
</script>

<template>
  <div class="video-danmaku-container">
    <!-- 视频播放器区域 -->
    <div class="video-player">
      <!-- 视频内容（模拟） -->
      <div class="video-content">
        <div class="video-placeholder">
          <div class="video-text">视频内容区域</div>
          <div class="video-time">
            {{ formatTime(videoStatus.currentTime) }} / {{ formatTime(videoStatus.duration) }}
          </div>
        </div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="[]" :channels="8" :speeds="150" class="danmaku-layer">
        <template #danmu="{ danmu }">
          <div class="timeline-danmu">
            <span class="danmu-user">{{ danmu.user }}:</span>
            <span class="danmu-text" :style="{ color: danmu.color }">
              {{ danmu.text }}
            </span>
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 视频控制区域 -->
    <div class="video-controls">
      <!-- 播放进度条 -->
      <div class="progress-bar-container">
        <input
          type="range"
          min="0"
          :max="videoStatus.duration"
          step="0.1"
          v-model="videoStatus.currentTime"
          @input="seekTo(videoStatus.currentTime)"
          class="progress-bar"
        />
        <div
          class="progress-fill"
          :style="{ width: `${(videoStatus.currentTime / videoStatus.duration) * 100}%` }"
        ></div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons">
        <button v-if="!videoStatus.playing" @click="play" class="control-btn play">▶ 播放</button>
        <button v-else @click="pause" class="control-btn pause">⏸ 暂停</button>

        <button @click="restart" class="control-btn restart">⟲ 重新开始</button>
      </div>
    </div>

    <!-- 弹幕发送区域 -->
    <div class="danmu-input-area">
      <div class="color-selector">
        <div
          v-for="color in colorOptions"
          :key="color"
          class="color-option"
          :style="{ backgroundColor: color }"
          :class="{ active: danmuColor === color }"
          @click="danmuColor = color"
        ></div>
      </div>

      <div class="input-wrapper">
        <input v-model="newDanmu" placeholder="发送弹幕..." @keyup.enter="addUserDanmu" />
        <button @click="addUserDanmu" :disabled="!newDanmu">发送</button>
      </div>
    </div>

    <!-- 弹幕时间轴 -->
    <div class="danmu-timeline">
      <h3>弹幕时间轴</h3>
      <div class="timeline-markers">
        <div
          v-for="danmu in timelineDanmus"
          :key="danmu.id"
          class="timeline-marker"
          :style="{
            left: `${(danmu.time / videoStatus.duration) * 100}%`,
            backgroundColor: danmu.color,
          }"
          :title="`${formatTime(danmu.time)} - ${danmu.text}`"
        ></div>

        <div
          v-for="danmu in userDanmus"
          :key="danmu.id"
          class="timeline-marker user"
          :style="{
            left: `${(danmu.time / videoStatus.duration) * 100}%`,
            backgroundColor: danmu.color,
          }"
          :title="`${formatTime(danmu.time)} - ${danmu.text} (你的弹幕)`"
        ></div>
      </div>
    </div>

    <!-- 弹幕列表 -->
    <div class="danmu-list">
      <h3>弹幕列表</h3>
      <div class="list-container">
        <div
          v-for="danmu in [...timelineDanmus, ...userDanmus].sort((a, b) => a.time - b.time)"
          :key="danmu.id"
          class="danmu-item"
          :class="{ active: videoStatus.currentTime >= danmu.time }"
        >
          <div class="danmu-time">{{ formatTime(danmu.time) }}</div>
          <div class="danmu-content" :style="{ color: danmu.color }">
            <span class="danmu-user">{{ danmu.user }}:</span>
            <span class="danmu-text">{{ danmu.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-danmaku-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.video-player {
  position: relative;
  height: 300px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-content {
  width: 100%;
  height: 100%;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #555;
}

.video-text {
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.video-time {
  font-size: 14px;
  color: #888;
}

.danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.timeline-danmu {
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 10px;
  color: white;
}

.danmu-user {
  font-weight: bold;
  font-size: 14px;
  margin-right: 4px;
  opacity: 0.8;
}

.danmu-text {
  font-size: 14px;
}

.video-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-bar-container {
  position: relative;
  height: 20px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  background-color: #ddd;
  border-radius: 5px;
  position: relative;
  z-index: 2;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background-color: #1976d2;
  border-radius: 50%;
  cursor: pointer;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 10px;
  background-color: #64b5f6;
  border-radius: 5px;
  pointer-events: none;
  z-index: 1;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.play {
  background-color: #4caf50;
}

.pause {
  background-color: #ff9800;
}

.restart {
  background-color: #2196f3;
}

.danmu-input-area {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-selector {
  display: flex;
  gap: 6px;
}

.color-option {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-option.active {
  border-color: #333;
  transform: scale(1.1);
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

.input-wrapper button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.danmu-timeline {
  margin-top: 10px;
}

.danmu-timeline h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.timeline-markers {
  position: relative;
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.timeline-marker {
  position: absolute;
  width: 8px;
  height: 16px;
  background-color: #2196f3;
  top: 7px;
  border-radius: 2px;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.2s;
}

.timeline-marker:hover {
  height: 24px;
  top: 3px;
}

.timeline-marker.user {
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.danmu-list {
  margin-top: 10px;
}

.danmu-list h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.list-container {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.danmu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  opacity: 0.7;
  transition: all 0.2s;
}

.danmu-item.active {
  opacity: 1;
  background-color: rgba(33, 150, 243, 0.1);
}

.danmu-time {
  font-size: 12px;
  color: #666;
  width: 40px;
}

.danmu-content {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
