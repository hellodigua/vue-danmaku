<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import VueDanmaku from 'vue-danmaku'

// 幻灯片数据
const slides = [
  {
    id: 1,
    title: '项目介绍',
    content: '这是一个基于Vue的弹幕组件\n支持各种自定义功能\n适用于多种场景',
    backgroundColor: '#e3f2fd',
    textColor: '#0d47a1',
  },
  {
    id: 2,
    title: '组件特性',
    content: '• 自定义弹幕样式\n• 弹幕轨道控制\n• 循环播放模式\n• 性能优化',
    backgroundColor: '#e8f5e9',
    textColor: '#1b5e20',
  },
  {
    id: 3,
    title: '使用场景',
    content: '• 视频播放弹幕\n• 直播间互动\n• 演示文稿\n• 实时评论',
    backgroundColor: '#fff3e0',
    textColor: '#e65100',
  },
  {
    id: 4,
    title: '如何使用',
    content:
      '安装: npm install vue-danmaku\n引入: import VueDanmaku from "vue-danmaku"\n配置: <vue-danmaku :danmus="danmus" />',
    backgroundColor: '#f3e5f5',
    textColor: '#4a148c',
  },
  {
    id: 5,
    title: '高级功能',
    content: '• 时间轴模式\n• 悬浮暂停\n• 自定义插槽\n• 事件处理',
    backgroundColor: '#e1f5fe',
    textColor: '#01579b',
  },
]

// 幻灯片弹幕解说
const slideDanmus = {
  1: [
    { id: 101, text: '欢迎使用Vue Danmaku组件', timing: 1000, style: { color: '#1976d2', fontWeight: 'bold' } },
    { id: 102, text: '这是一个强大的弹幕交互组件', timing: 3000, style: { color: '#0d47a1' } },
    { id: 103, text: '可以轻松集成到您的Vue项目中', timing: 5000, style: { color: '#283593' } },
  ],
  2: [
    { id: 201, text: '自定义样式让弹幕更美观', timing: 1000, style: { color: '#388e3c', fontWeight: 'bold' } },
    { id: 202, text: '可以控制弹幕的轨道数量', timing: 3000, style: { color: '#2e7d32' } },
    { id: 203, text: '循环模式适用于持续展示', timing: 5000, style: { color: '#1b5e20' } },
    { id: 204, text: '性能模式使用requestAnimationFrame优化', timing: 7000, style: { color: '#33691e' } },
  ],
  3: [
    { id: 301, text: '视频弹幕是最常见的应用场景', timing: 1000, style: { color: '#f57c00', fontWeight: 'bold' } },
    { id: 302, text: '直播间可以增强用户互动体验', timing: 3000, style: { color: '#e65100' } },
    { id: 303, text: '在演示文稿中添加实时注解', timing: 5000, style: { color: '#ff6f00' } },
    { id: 304, text: '可以用于展示用户实时评论', timing: 7000, style: { color: '#ff8f00' } },
  ],
  4: [
    { id: 401, text: '通过npm轻松安装', timing: 1000, style: { color: '#7b1fa2', fontWeight: 'bold' } },
    { id: 402, text: '在组件中引入并注册', timing: 3000, style: { color: '#6a1b9a' } },
    { id: 403, text: '传入弹幕数据即可使用', timing: 5000, style: { color: '#4a148c' } },
    { id: 404, text: '查看文档了解更多配置选项', timing: 7000, style: { color: '#9c27b0' } },
  ],
  5: [
    {
      id: 501,
      text: '时间轴模式可以精确控制弹幕显示时间',
      timing: 1000,
      style: { color: '#0288d1', fontWeight: 'bold' },
    },
    { id: 502, text: '鼠标悬停可以暂停弹幕', timing: 3000, style: { color: '#0277bd' } },
    { id: 503, text: '通过插槽可以完全自定义弹幕内容', timing: 5000, style: { color: '#01579b' } },
    { id: 504, text: '丰富的事件让交互更灵活', timing: 7000, style: { color: '#006064' } },
  ],
}

// 当前幻灯片索引
const currentSlideIndex = ref(0)

// 弹幕组件实例
const danmakuRef = ref()

// 幻灯片控制
const slideControl = reactive({
  auto: false,
  interval: 10000, // 自动播放间隔（毫秒）
  danmuState: true, // 是否显示弹幕
})

// 自动播放定时器
let autoPlayTimer

// 当前幻灯片弹幕定时器
let danmuTimers = []

// 切换到下一张幻灯片
const nextSlide = () => {
  if (currentSlideIndex.value < slides.length - 1) {
    currentSlideIndex.value++
  } else {
    currentSlideIndex.value = 0
  }

  setupSlideDanmus()
}

// 切换到上一张幻灯片
const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  } else {
    currentSlideIndex.value = slides.length - 1
  }

  setupSlideDanmus()
}

// 跳转到指定幻灯片
const goToSlide = (index) => {
  currentSlideIndex.value = index
  setupSlideDanmus()
}

// 切换自动播放
const toggleAutoPlay = () => {
  slideControl.auto = !slideControl.auto

  if (slideControl.auto) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

// 开始自动播放
const startAutoPlay = () => {
  stopAutoPlay() // 清除之前的定时器

  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, slideControl.interval)
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 切换弹幕显示状态
const toggleDanmu = () => {
  slideControl.danmuState = !slideControl.danmuState

  if (slideControl.danmuState) {
    danmakuRef.value.show()
    setupSlideDanmus()
  } else {
    danmakuRef.value.hide()
    clearDanmuTimers()
  }
}

// 设置当前幻灯片的弹幕
const setupSlideDanmus = () => {
  // 清空当前弹幕和定时器
  danmakuRef.value.clear()
  clearDanmuTimers()

  // 如果弹幕已关闭，则不设置新的弹幕
  if (!slideControl.danmuState) return

  // 获取当前幻灯片的弹幕
  const currentSlide = slides[currentSlideIndex.value]
  const danmus = slideDanmus[currentSlide.id]

  if (!danmus || danmus.length === 0) return

  // 为每条弹幕设置定时器
  danmus.forEach((danmu) => {
    const timer = setTimeout(() => {
      danmakuRef.value.push({
        id: danmu.id,
        text: danmu.text,
        style: danmu.style,
      })
    }, danmu.timing)

    danmuTimers.push(timer)
  })
}

// 清除弹幕定时器
const clearDanmuTimers = () => {
  danmuTimers.forEach((timer) => clearTimeout(timer))
  danmuTimers = []
}

// 当前幻灯片
const currentSlide = computed(() => {
  return slides[currentSlideIndex.value]
})

onMounted(() => {
  // 初始化弹幕组件
  danmakuRef.value.resize()

  // 设置当前幻灯片的弹幕
  setupSlideDanmus()
})

onBeforeUnmount(() => {
  // 清除所有定时器
  stopAutoPlay()
  clearDanmuTimers()
})
</script>

<template>
  <div class="slides-danmaku-container">
    <!-- 幻灯片和弹幕区域 -->
    <div
      class="slide-container"
      :style="{
        backgroundColor: currentSlide.backgroundColor,
        color: currentSlide.textColor,
      }"
    >
      <!-- 幻灯片内容 -->
      <div class="slide-content">
        <h2 class="slide-title">{{ currentSlide.title }}</h2>
        <div class="slide-text">
          <p v-for="(line, index) in currentSlide.content.split('\n')" :key="index">
            {{ line }}
          </p>
        </div>
      </div>

      <!-- 弹幕层 -->
      <vue-danmaku ref="danmakuRef" :danmus="[]" :channels="8" :speeds="150" class="slides-danmaku-layer">
        <template #dm="{ danmu }">
          <div class="slide-danmu" :style="danmu.style || {}">
            {{ danmu.text }}
          </div>
        </template>
      </vue-danmaku>
    </div>

    <!-- 幻灯片控制区域 -->
    <div class="slide-controls">
      <div class="navigation-controls">
        <button @click="prevSlide" class="nav-btn prev">◀ 上一页</button>

        <div class="slide-indicators">
          <span
            v-for="(_, index) in slides"
            :key="index"
            class="indicator"
            :class="{ active: index === currentSlideIndex }"
            @click="goToSlide(index)"
          ></span>
        </div>

        <button @click="nextSlide" class="nav-btn next">下一页 ▶</button>
      </div>

      <div class="extra-controls">
        <button @click="toggleAutoPlay" class="control-btn" :class="{ active: slideControl.auto }">
          {{ slideControl.auto ? '停止自动播放' : '自动播放' }}
        </button>

        <button @click="toggleDanmu" class="control-btn" :class="{ active: slideControl.danmuState }">
          {{ slideControl.danmuState ? '隐藏弹幕解说' : '显示弹幕解说' }}
        </button>
      </div>
    </div>

    <!-- 幻灯片导航 -->
    <div class="slide-navigation">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="slide-thumbnail"
        :class="{ active: index === currentSlideIndex }"
        @click="goToSlide(index)"
      >
        <div
          class="thumbnail-content"
          :style="{
            backgroundColor: slide.backgroundColor,
            color: slide.textColor,
          }"
        >
          <div class="thumbnail-title">{{ slide.title }}</div>
        </div>
      </div>
    </div>

    <!-- 弹幕解说说明 -->
    <div class="danmu-explanation">
      <h3>弹幕解说功能说明</h3>
      <p>在幻灯片演示中集成弹幕解说，可以增强演示效果，并在不打断演示流程的情况下提供额外信息。</p>
      <p>每张幻灯片的弹幕会在特定时间点自动显示，内容与当前幻灯片相关。</p>
      <p>您可以通过上方的控制按钮开启/关闭弹幕解说功能。</p>
    </div>
  </div>
</template>

<style scoped>
.slides-danmaku-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.slide-container {
  position: relative;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  z-index: 1;
}

.slide-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.slide-text {
  font-size: 20px;
  line-height: 1.6;
  white-space: pre-line;
}

.slide-text p {
  margin-bottom: 10px;
}

.slides-danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.slide-danmu {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.slide-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  padding: 8px 16px;
  background-color: #546e7a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #455a64;
}

.prev {
  background-color: #78909c;
}

.next {
  background-color: #546e7a;
}

.slide-indicators {
  display: flex;
  gap: 8px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #cfd8dc;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.indicator:hover {
  transform: scale(1.2);
}

.indicator.active {
  background-color: #546e7a;
}

.extra-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.control-btn {
  padding: 8px 16px;
  background-color: #eceff1;
  color: #455a64;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.control-btn:hover {
  background-color: #cfd8dc;
}

.control-btn.active {
  background-color: #90a4ae;
  color: white;
  border-color: #78909c;
}

.slide-navigation {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.slide-thumbnail {
  flex: 0 0 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.slide-thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.slide-thumbnail.active {
  border-color: #546e7a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.thumbnail-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.danmu-explanation {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-left: 4px solid #546e7a;
  border-radius: 4px;
}

.danmu-explanation h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #37474f;
}

.danmu-explanation p {
  margin: 5px 0;
  font-size: 14px;
  color: #546e7a;
  line-height: 1.5;
}
</style>
