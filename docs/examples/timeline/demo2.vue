<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 课程内容
const lectureContent = {
  title: '前端框架入门课程',
  duration: 600, // 总时长（秒）
  chapters: [
    { id: 1, title: '第一章：框架介绍', startTime: 0, endTime: 120 },
    { id: 2, title: '第二章：组件化开发', startTime: 120, endTime: 300 },
    { id: 3, title: '第三章：状态管理', startTime: 300, endTime: 450 },
    { id: 4, title: '第四章：路由与导航', startTime: 450, endTime: 600 },
  ],
  // 关键时间点
  keyPoints: [
    { id: 1, time: 15, title: '框架的优势' },
    { id: 2, time: 45, title: '对比其他框架' },
    { id: 3, time: 90, title: '适用场景' },
    { id: 4, time: 150, title: '组件的概念' },
    { id: 5, time: 210, title: '组件通信' },
    { id: 6, time: 270, title: '生命周期' },
    { id: 7, time: 330, title: '状态管理简介' },
    { id: 8, time: 390, title: '复杂状态处理' },
    { id: 9, time: 470, title: '路由基础' },
    { id: 10, time: 540, title: '动态路由' },
  ],
}

// 笔记弹幕数据
const notesDanmus = [
  { id: 1, time: 15, text: '记住框架的优势：组件化、响应式、虚拟DOM', type: 'important', color: '#f44336' },
  { id: 2, time: 30, text: '框架选择需要根据项目需求来决定', type: 'tip', color: '#2196f3' },
  { id: 3, time: 60, text: '小型项目也可以不使用框架，用原生JS开发', type: 'note', color: '#4caf50' },
  { id: 4, time: 100, text: '学习曲线：Vue < React < Angular', type: 'tip', color: '#2196f3' },
  { id: 5, time: 130, text: '组件可以理解为UI的独立功能单元', type: 'concept', color: '#9c27b0' },
  { id: 6, time: 170, text: '父组件通过props向子组件传递数据', type: 'important', color: '#f44336' },
  { id: 7, time: 190, text: '子组件通过事件向父组件通信', type: 'important', color: '#f44336' },
  { id: 8, time: 220, text: '注意组件的单向数据流特性', type: 'warning', color: '#ff9800' },
  { id: 9, time: 250, text: '不要在子组件中直接修改props', type: 'warning', color: '#ff9800' },
  { id: 10, time: 280, text: '生命周期钩子可以执行定时任务、API调用等', type: 'tip', color: '#2196f3' },
  { id: 11, time: 320, text: '大型应用推荐使用状态管理库', type: 'note', color: '#4caf50' },
  { id: 12, time: 340, text: '单向数据流使应用状态更可预测', type: 'concept', color: '#9c27b0' },
  { id: 13, time: 380, text: '避免过早引入复杂的状态管理', type: 'tip', color: '#2196f3' },
  { id: 14, time: 410, text: '状态管理不是银弹，简单应用可能适得其反', type: 'warning', color: '#ff9800' },
  { id: 15, time: 460, text: '前端路由不需要刷新整个页面', type: 'concept', color: '#9c27b0' },
  { id: 16, time: 500, text: '路由参数可以通过URL传递', type: 'tip', color: '#2196f3' },
  { id: 17, time: 530, text: '路由守卫可以用于权限控制', type: 'important', color: '#f44336' },
  { id: 18, time: 570, text: '嵌套路由适合复杂的页面布局', type: 'note', color: '#4caf50' },
]

// 当前显示的笔记
const activeNotes = ref([])

// 用户笔记
const userNotes = ref([])

// 弹幕组件实例
const danmakuRef = ref()

// 课程播放状态
const lectureStatus = reactive({
  playing: false,
  currentTime: 0,
  speed: 1, // 播放速度
})

// 新增笔记内容
const newNote = reactive({
  text: '',
  type: 'note',
})

// 笔记类型
const noteTypes = [
  { value: 'note', label: '普通笔记', color: '#4caf50' },
  { value: 'important', label: '重要内容', color: '#f44336' },
  { value: 'concept', label: '概念理解', color: '#9c27b0' },
  { value: 'tip', label: '小技巧', color: '#2196f3' },
  { value: 'warning', label: '注意事项', color: '#ff9800' },
]

// 播放定时器
let playTimer

// 开始播放
const play = () => {
  if (lectureStatus.playing) return

  lectureStatus.playing = true

  const timeStep = 100 // 每100毫秒更新一次

  playTimer = setInterval(() => {
    if (lectureStatus.currentTime < lectureContent.duration) {
      lectureStatus.currentTime += (timeStep / 1000) * lectureStatus.speed
      checkNotesDanmus()
    } else {
      pause()
      lectureStatus.currentTime = lectureContent.duration
    }
  }, timeStep)
}

// 暂停播放
const pause = () => {
  lectureStatus.playing = false
  if (playTimer) {
    clearInterval(playTimer)
  }
}

// 设置播放速度
const setSpeed = (speed) => {
  lectureStatus.speed = speed

  if (lectureStatus.playing) {
    // 重新设置定时器以应用新速度
    pause()
    play()
  }
}

// 跳转到指定时间
const seekTo = (time) => {
  lectureStatus.currentTime = time

  // 清除当前显示的弹幕
  activeNotes.value = []
  danmakuRef.value.clear()

  // 如果正在播放，则立即检查当前时间点的弹幕
  if (lectureStatus.playing) {
    checkNotesDanmus()
  }
}

// 跳转到特定章节
const jumpToChapter = (chapter) => {
  seekTo(chapter.startTime)
  if (!lectureStatus.playing) {
    play()
  }
}

// 跳转到关键点
const jumpToKeyPoint = (keyPoint) => {
  seekTo(keyPoint.time)
  if (!lectureStatus.playing) {
    play()
  }
}

// 检查并显示笔记弹幕
const checkNotesDanmus = () => {
  const currentTime = Math.floor(lectureStatus.currentTime)

  // 检查预设笔记
  notesDanmus.forEach((note) => {
    if (note.time === currentTime && !activeNotes.value.includes(note.id)) {
      activeNotes.value.push(note.id)

      // 发送到弹幕组件
      danmakuRef.value.push({
        id: note.id,
        text: note.text,
        type: note.type,
        color: note.color,
        isPreset: true,
      })
    }
  })

  // 检查用户笔记
  userNotes.value.forEach((note) => {
    if (note.time === currentTime && !activeNotes.value.includes(note.id)) {
      activeNotes.value.push(note.id)

      // 发送到弹幕组件
      danmakuRef.value.push({
        id: note.id,
        text: note.text,
        type: note.type,
        color: getNoteTypeColor(note.type),
        isUser: true,
      })
    }
  })
}

// 添加用户笔记
const addUserNote = () => {
  if (!newNote.text) return

  const noteId = Date.now()
  const currentTime = Math.floor(lectureStatus.currentTime)

  const userNote = {
    id: noteId,
    time: currentTime,
    text: newNote.text,
    type: newNote.type,
  }

  // 添加到用户笔记列表
  userNotes.value.push(userNote)

  // 如果当前时间正好是笔记时间，立即显示
  if (Math.floor(lectureStatus.currentTime) === currentTime) {
    activeNotes.value.push(noteId)

    danmakuRef.value.push({
      id: noteId,
      text: userNote.text,
      type: userNote.type,
      color: getNoteTypeColor(userNote.type),
      isUser: true,
    })
  }

  // 重置表单
  newNote.text = ''
  newNote.type = 'note'
}

// 删除用户笔记
const deleteUserNote = (noteId) => {
  const index = userNotes.value.findIndex((note) => note.id === noteId)
  if (index !== -1) {
    userNotes.value.splice(index, 1)
  }
}

// 根据笔记类型获取颜色
const getNoteTypeColor = (type) => {
  const noteType = noteTypes.find((t) => t.value === type)
  return noteType ? noteType.color : '#4caf50'
}

// 获取当前章节
const currentChapter = computed(() => {
  const time = lectureStatus.currentTime
  return (
    lectureContent.chapters.find((chapter) => time >= chapter.startTime && time < chapter.endTime) ||
    lectureContent.chapters[0]
  )
})

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 当前进度百分比
const progressPercentage = computed(() => {
  return (lectureStatus.currentTime / lectureContent.duration) * 100
})

onMounted(() => {
  // 初始化弹幕组件
  danmakuRef.value.resize()
})

onBeforeUnmount(() => {
  if (playTimer) {
    clearInterval(playTimer)
  }
})
</script>

<template>
  <div class="lecture-notes-container">
    <!-- 课程标题 -->
    <h2 class="lecture-title">{{ lectureContent.title }}</h2>

    <!-- 视频和弹幕区域 -->
    <div class="lecture-player">
      <!-- 视频内容（模拟） -->
      <div class="lecture-content">
        <div class="current-chapter">
          <div class="chapter-label">当前章节:</div>
          <div class="chapter-title">{{ currentChapter.title }}</div>
        </div>

        <div class="lecture-time">
          {{ formatTime(lectureStatus.currentTime) }} / {{ formatTime(lectureContent.duration) }}
        </div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="[]" :channels="8" :speeds="150" class="notes-danmaku-layer">
        <template #danmu="{ danmu }">
          <div class="note-danmu" :class="{ 'user-note': danmu.isUser }">
            <div class="note-badge" :style="{ backgroundColor: danmu.color }">
              {{ danmu.type }}
            </div>
            <div class="note-content">{{ danmu.text }}</div>
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 播放控制 -->
    <div class="lecture-controls">
      <!-- 进度条 -->
      <div class="progress-container">
        <input
          type="range"
          min="0"
          :max="lectureContent.duration"
          step="1"
          v-model="lectureStatus.currentTime"
          @input="seekTo(lectureStatus.currentTime)"
          class="progress-slider"
        />
        <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>

        <!-- 关键点标记 -->
        <div
          v-for="point in lectureContent.keyPoints"
          :key="point.id"
          class="key-point-marker"
          :style="{ left: `${(point.time / lectureContent.duration) * 100}%` }"
          :title="point.title"
          @click="jumpToKeyPoint(point)"
        ></div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls-row">
        <div class="play-controls">
          <button v-if="!lectureStatus.playing" @click="play" class="control-btn play">▶ 播放</button>
          <button v-else @click="pause" class="control-btn pause">⏸ 暂停</button>
        </div>

        <div class="speed-controls">
          <span class="speed-label">速度:</span>
          <button
            v-for="speed in [0.5, 1, 1.5, 2]"
            :key="speed"
            @click="setSpeed(speed)"
            class="speed-btn"
            :class="{ active: lectureStatus.speed === speed }"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

    <!-- 章节导航和笔记区域 -->
    <div class="lecture-sections">
      <!-- 章节导航 -->
      <div class="chapters-section">
        <h3>章节目录</h3>
        <div class="chapters-list">
          <div
            v-for="chapter in lectureContent.chapters"
            :key="chapter.id"
            class="chapter-item"
            :class="{ active: chapter.id === currentChapter.id }"
            @click="jumpToChapter(chapter)"
          >
            <div class="chapter-name">{{ chapter.title }}</div>
            <div class="chapter-time">{{ formatTime(chapter.startTime) }} - {{ formatTime(chapter.endTime) }}</div>
          </div>
        </div>
      </div>

      <!-- 关键点 -->
      <div class="keypoints-section">
        <h3>关键知识点</h3>
        <div class="keypoints-list">
          <div
            v-for="point in lectureContent.keyPoints"
            :key="point.id"
            class="keypoint-item"
            :class="{ active: Math.abs(lectureStatus.currentTime - point.time) < 5 }"
            @click="jumpToKeyPoint(point)"
          >
            <div class="keypoint-time">{{ formatTime(point.time) }}</div>
            <div class="keypoint-title">{{ point.title }}</div>
          </div>
        </div>
      </div>

      <!-- 笔记添加 -->
      <div class="notes-section">
        <h3>添加笔记</h3>
        <div class="note-form">
          <div class="note-type-selector">
            <select v-model="newNote.type">
              <option v-for="type in noteTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="note-input">
            <input v-model="newNote.text" placeholder="在当前时间点添加笔记..." @keyup.enter="addUserNote" />
            <button @click="addUserNote" :disabled="!newNote.text">添加</button>
          </div>
        </div>

        <!-- 用户笔记列表 -->
        <div class="user-notes">
          <h4>我的笔记 ({{ userNotes.length }})</h4>
          <div class="user-notes-list">
            <div v-for="note in userNotes.sort((a, b) => a.time - b.time)" :key="note.id" class="user-note-item">
              <div class="note-header">
                <div class="note-type-badge" :style="{ backgroundColor: getNoteTypeColor(note.type) }">
                  {{ note.type }}
                </div>
                <div class="note-time">{{ formatTime(note.time) }}</div>
                <button class="delete-note" @click="deleteUserNote(note.id)">×</button>
              </div>
              <div class="note-body">{{ note.text }}</div>
            </div>

            <div v-if="userNotes.length === 0" class="no-notes">还没有添加任何笔记</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lecture-notes-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lecture-title {
  font-size: 22px;
  margin: 0 0 15px 0;
  color: #2196f3;
}

.lecture-player {
  position: relative;
  height: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.lecture-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
}

.current-chapter {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.chapter-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.chapter-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.lecture-time {
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.notes-danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.note-danmu {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 4px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  pointer-events: auto;
}

.note-danmu.user-note {
  background-color: rgba(255, 248, 225, 0.95);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.note-badge {
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
  text-transform: capitalize;
}

.note-content {
  font-size: 14px;
  color: #333;
}

.lecture-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
}

.progress-container {
  position: relative;
  height: 20px;
}

.progress-slider {
  width: 100%;
  height: 10px;
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  outline: none;
  position: relative;
  z-index: 2;
  margin: 0;
  cursor: pointer;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background-color: #2196f3;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  position: absolute;
  top: 5px;
  left: 0;
  height: 10px;
  background-color: #2196f3;
  border-radius: 5px;
  pointer-events: none;
  z-index: 1;
}

.key-point-marker {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #ff5722;
  border-radius: 50%;
  top: 6px;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
  transition: all 0.2s;
}

.key-point-marker:hover {
  transform: translateX(-50%) scale(1.5);
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.play-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 6px 12px;
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

.speed-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.speed-label {
  font-size: 14px;
  color: #666;
}

.speed-btn {
  padding: 4px 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
}

.speed-btn.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

.lecture-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chapters-section,
.keypoints-section,
.notes-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.chapters-section h3,
.keypoints-section h3,
.notes-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.notes-section {
  grid-column: span 2;
}

.chapters-list,
.keypoints-list {
  max-height: 200px;
  overflow-y: auto;
}

.chapter-item,
.keypoint-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9f9f9;
}

.chapter-item:hover,
.keypoint-item:hover {
  background-color: #e3f2fd;
}

.chapter-item.active,
.keypoint-item.active {
  background-color: #bbdefb;
}

.chapter-name,
.keypoint-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.chapter-time,
.keypoint-time {
  font-size: 12px;
  color: #666;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.note-type-selector select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.note-input {
  display: flex;
  gap: 8px;
}

.note-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.note-input button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.note-input button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.user-notes h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 10px 0;
}

.user-notes-list {
  max-height: 200px;
  overflow-y: auto;
}

.user-note-item {
  background-color: #fff8e1;
  border-radius: 4px;
  margin-bottom: 10px;
  border: 1px solid #ffe082;
}

.note-header {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background-color: #fff8e1;
  border-bottom: 1px solid #ffe082;
  border-radius: 4px 4px 0 0;
}

.note-type-badge {
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
  text-transform: capitalize;
}

.note-time {
  font-size: 12px;
  color: #666;
  margin-right: auto;
}

.delete-note {
  background: none;
  border: none;
  color: #f44336;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
}

.note-body {
  padding: 10px;
  font-size: 14px;
  color: #333;
}

.no-notes {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .lecture-sections {
    grid-template-columns: 1fr;
  }

  .notes-section {
    grid-column: span 1;
  }
}
</style>
