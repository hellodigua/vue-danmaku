<template>
  <ClientOnly>
    <p v-html="decodeURIComponent(description)"></p>
    <div class="example">
      <exampleVue :example="examples[path]" />
      <div class="divider" style="margin: 0"></div>
      <div class="op-btns">
        <div class="tooltip">
          <div class="icon-wrapper op-btn" @click="copyCode">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8666">
              <path
                d="M830.6 984.4H362.2c-5 0-10-0.2-15-0.8-5-0.4-10-1.2-15-2.2-5-1-9.8-2.2-14.6-3.6-4.8-1.4-9.6-3.2-14.2-5-4.6-2-9.2-4-13.6-6.4-4.4-2.4-8.8-5-13-7.8-4.2-2.8-8.2-5.8-12.2-9s-7.6-6.6-11.2-10.2c-3.6-3.6-7-7.4-10.2-11.2-3.2-3.8-6.2-8-9-12.2-2.8-4.2-5.4-8.6-7.8-13-2.4-4.4-4.6-9-6.4-13.6-2-4.6-3.6-9.4-5-14.2-1.4-4.8-2.6-9.8-3.6-14.6-1-5-1.8-10-2.2-15-0.4-5-0.8-10-0.8-15V362.2c0-5 0.2-10 0.8-15 0.4-5 1.2-10 2.2-15 1-5 2.2-9.8 3.6-14.6 1.4-4.8 3.2-9.6 5-14.2 2-4.6 4-9.2 6.4-13.6 2.4-4.4 5-8.8 7.8-13 2.8-4.2 5.8-8.2 9-12.2 3.2-3.8 6.6-7.6 10.2-11.2 3.6-3.6 7.4-7 11.2-10.2 3.8-3.2 8-6.2 12.2-9 4.2-2.8 8.6-5.4 13-7.8 4.4-2.4 9-4.6 13.6-6.4 4.6-2 9.4-3.6 14.2-5 4.8-1.4 9.8-2.6 14.6-3.6 5-1 10-1.8 15-2.2 5-0.4 10-0.8 15-0.8h468.2c5 0 10 0.2 15 0.8s10 1.2 15 2.2c5 1 9.8 2.2 14.6 3.6 4.8 1.4 9.6 3.2 14.2 5 4.6 2 9.2 4 13.6 6.4 4.4 2.4 8.8 5 13 7.8 4.2 2.8 8.2 5.8 12.2 9 3.8 3.2 7.6 6.6 11.2 10.2 3.6 3.6 7 7.2 10.2 11.2 3.2 3.8 6.2 8 9 12.2 2.8 4.2 5.4 8.6 7.8 13 2.4 4.4 4.6 9 6.4 13.6 2 4.6 3.6 9.4 5 14.2 1.4 4.8 2.6 9.8 3.6 14.6 1 5 1.8 10 2.2 15 0.4 5 0.8 10 0.8 15v468.2c0 5-0.2 10-0.8 15-0.4 5-1.2 10-2.2 15-1 5-2.2 9.8-3.6 14.6s-3.2 9.6-5 14.2c-2 4.6-4 9.2-6.4 13.6-2.4 4.4-5 8.8-7.8 13-2.8 4.2-5.8 8.2-9 12.2s-6.6 7.6-10.2 11.2c-3.6 3.6-7.2 7-11.2 10.2-3.8 3.2-8 6.2-12.2 9-4.2 2.8-8.6 5.4-13 7.8-4.4 2.4-9 4.6-13.6 6.4-4.6 2-9.4 3.6-14.2 5-4.8 1.4-9.8 2.6-14.6 3.6-5 1-10 1.8-15 2.2-4.8 0.8-9.8 1-14.8 1zM362.2 275.8c-2.8 0-5.6 0.2-8.4 0.4-2.8 0.2-5.6 0.6-8.4 1.2-2.8 0.6-5.6 1.2-8.2 2-2.8 0.8-5.4 1.8-8 2.8s-5.2 2.2-7.6 3.6c-2.4 1.4-5 2.8-7.2 4.4-2.4 1.6-4.6 3.2-6.8 5-2.2 1.8-4.2 3.8-6.2 5.6-2 2-4 4.2-5.6 6.2-1.8 2.2-3.4 4.4-5 6.8-1.6 2.4-3 4.8-4.4 7.2-1.4 2.4-2.6 5-3.6 7.6s-2 5.2-2.8 8c-0.8 2.8-1.6 5.4-2 8.2-0.6 2.8-1 5.6-1.2 8.4-0.2 2.8-0.4 5.6-0.4 8.4v468.2c0 2.8 0.2 5.6 0.4 8.4 0.2 2.8 0.6 5.6 1.2 8.4 0.6 2.8 1.2 5.6 2 8.2 0.8 2.6 1.8 5.4 2.8 8 1 2.6 2.2 5.2 3.6 7.6 1.4 2.4 2.8 5 4.4 7.2 1.6 2.4 3.2 4.6 5 6.8 1.8 2.2 3.8 4.2 5.6 6.2 2 2 4.2 4 6.2 5.8 2.2 1.8 4.4 3.4 6.8 5 2.4 1.6 4.8 3 7.2 4.4 2.4 1.4 5 2.6 7.6 3.6 2.6 1 5.2 2 8 2.8 2.8 0.8 5.4 1.6 8.2 2 2.8 0.6 5.6 1 8.4 1.2 2.8 0.2 5.6 0.4 8.4 0.4h468.2c2.8 0 5.6-0.2 8.4-0.4 2.8-0.2 5.6-0.6 8.4-1.2 2.8-0.6 5.6-1.2 8.2-2 2.6-0.8 5.4-1.8 8-2.8 2.6-1 5.2-2.4 7.6-3.6 2.4-1.4 5-2.8 7.2-4.4 2.4-1.6 4.6-3.2 6.8-5 2.2-1.8 4.2-3.8 6.2-5.6 2-2 4-4.2 5.8-6.4 1.8-2.2 3.4-4.4 5-6.8 1.6-2.4 3-4.8 4.4-7.2 1.4-2.4 2.6-5 3.6-7.6 1-2.6 2-5.2 2.8-8 0.8-2.8 1.6-5.4 2-8.2 0.6-2.8 1-5.6 1.2-8.4 0.2-2.8 0.4-5.6 0.4-8.4V362.2c0-2.8-0.2-5.6-0.4-8.4-0.2-2.8-0.6-5.6-1.2-8.4-0.6-2.8-1.2-5.6-2-8.2-0.8-2.6-1.8-5.4-2.8-8-1-2.6-2.4-5.2-3.6-7.6-1.4-2.4-2.8-5-4.4-7.2-1.6-2.4-3.2-4.6-5-6.8-1.8-2.2-3.8-4.2-5.6-6.2-2-2-4.2-4-6.2-5.8-2.2-1.8-4.4-3.4-6.8-5-2.4-1.6-4.8-3-7.2-4.4-2.4-1.4-5-2.6-7.6-3.6-2.6-1-5.2-2-8-2.8-2.8-0.8-5.4-1.6-8.2-2-2.8-0.6-5.6-1-8.4-1.2-2.8-0.2-5.6-0.4-8.4-0.4H362.2z"
                p-id="8667"
              ></path>
              <path
                d="M242 815.8H191.4c-5 0-10-0.2-15-0.8-5-0.4-9.8-1.2-14.8-2.2-4.8-1-9.6-2.2-14.4-3.6-4.8-1.4-9.4-3.2-14-5-4.6-2-9-4-13.4-6.4-4.4-2.4-8.6-5-12.8-7.6-4-2.8-8.2-5.8-12-8.8-3.8-3.2-7.6-6.6-11-10-3.4-3.4-6.8-7.2-10-11s-6.2-7.8-8.8-12c-2.8-4.2-5.4-8.4-7.6-12.8-2.4-4.4-4.4-8.8-6.4-13.4-1.8-4.6-3.6-9.2-5-14-1.4-4.8-2.6-9.6-3.6-14.4-1-4.8-1.8-9.8-2.2-14.8-0.4-5-0.8-10-0.8-14.8v-456c0-2.8 0-5.6 0.2-8.4 0.2-2.8 0.4-5.6 0.6-8.2 0.2-2.8 0.6-5.4 1-8.2 0.4-2.8 0.8-5.4 1.4-8.2 0.6-2.6 1.2-5.4 1.8-8 0.6-2.6 1.4-5.4 2.2-8 0.8-2.6 1.6-5.2 2.6-7.8l3-7.8c1-2.6 2.2-5 3.4-7.6 1.2-2.4 2.4-5 3.8-7.4 1.2-2.4 2.6-4.8 4-7.2 1.4-2.4 3-4.6 4.4-7 1.6-2.2 3.2-4.6 4.8-6.8 1.6-2.2 3.4-4.4 5-6.6 1.8-2.2 3.6-4.2 5.4-6.2 1.8-2 3.8-4 5.6-6 2-2 4-3.8 6-5.8 2-1.8 4.2-3.6 6.2-5.4 2.2-1.8 4.4-3.4 6.6-5 2.2-1.6 4.4-3.2 6.8-4.8 2.2-1.6 4.6-3 7-4.4 2.4-1.4 4.8-2.8 7.2-4 2.4-1.2 4.8-2.6 7.4-3.8 2.4-1.2 5-2.4 7.6-3.4l7.8-3c2.6-1 5.2-1.8 7.8-2.6 2.6-0.8 5.2-1.6 8-2.2 2.6-0.6 5.4-1.2 8-1.8 2.6-0.6 5.4-1 8.2-1.4 2.8-0.4 5.4-0.8 8.2-1 2.8-0.2 5.4-0.4 8.2-0.6 2.8-0.2 5.6-0.2 8.2-0.2h455.8c5 0 10 0.2 15 0.8 5 0.4 9.8 1.2 14.8 2.2 4.8 1 9.8 2.2 14.4 3.6 4.8 1.4 9.4 3.2 14 5 4.6 1.8 9 4 13.4 6.4 4.4 2.4 8.6 5 12.8 7.6 4.2 2.8 8.2 5.8 12 8.8 3.8 3.2 7.6 6.6 11 10 3.4 3.4 6.8 7.2 10 11s6.2 7.8 8.8 12c2.8 4 5.4 8.4 7.6 12.8 2.4 4.4 4.4 8.8 6.4 13.4 1.8 4.6 3.6 9.2 5 14 1.4 4.8 2.6 9.6 3.6 14.4 1 4.8 1.8 9.8 2.2 14.8 0.4 5 0.8 10 0.8 14.8v0.8l-1 50.6c-0.4 18.6-15.8 33.4-34.4 33-18.6-0.4-33.4-15.8-33-34.4l1-50.2c0-2.6-0.2-5.2-0.4-8s-0.6-5.4-1.2-8.2c-0.6-2.8-1.2-5.4-2-8-0.8-2.6-1.8-5.2-2.8-7.8-1-2.6-2.2-5-3.6-7.4-1.4-2.4-2.8-4.8-4.2-7-1.6-2.2-3.2-4.6-5-6.6a82.42 82.42 0 0 0-11.8-11.8c-2.2-1.8-4.4-3.4-6.6-5-2.2-1.6-4.6-3-7-4.2-2.4-1.2-5-2.4-7.4-3.6-2.6-1-5.2-2-7.8-2.8-2.6-0.8-5.4-1.4-8-2-2.6-0.6-5.4-1-8.2-1.2-2.8-0.2-5.6-0.4-8.2-0.4H208.2c-1.6 0-3.2 0-4.8 0.2-1.6 0-3.4 0.2-5 0.4s-3.4 0.4-5 0.6c-1.6 0.2-3.2 0.6-4.8 0.8-1.6 0.4-3.2 0.6-4.8 1.2-1.6 0.4-3.2 0.8-4.8 1.4-1.6 0.4-3.2 1-4.8 1.6-1.6 0.6-3.2 1.2-4.6 1.8-1.6 0.6-3.2 1.4-4.6 2-1.4 0.8-3 1.4-4.4 2.2-1.4 0.8-3 1.6-4.4 2.4-1.4 0.8-2.8 1.8-4.2 2.6-1.4 1-2.8 1.8-4 2.8-1.4 1-2.6 2-4 3-1.2 1-2.6 2.2-3.8 3.2-1.2 1.2-2.4 2.2-3.6 3.4-1.2 1.2-2.4 2.4-3.4 3.6-1.2 1.2-2.2 2.4-3.2 3.8-1 1.2-2 2.6-3 4s-2 2.8-2.8 4c-1 1.4-1.8 2.8-2.6 4.2-0.8 1.4-1.6 2.8-2.4 4.4-0.8 1.4-1.6 3-2.2 4.4-0.8 1.4-1.4 3-2 4.6-0.6 1.6-1.2 3-1.8 4.6-0.6 1.6-1 3.2-1.6 4.8-0.4 1.6-1 3.2-1.4 4.8-0.4 1.6-0.8 3.2-1 4.8-0.4 1.6-0.6 3.2-0.8 4.8-0.2 1.6-0.4 3.2-0.6 5-0.2 1.6-0.2 3.4-0.4 5 0 1.6-0.2 3.4-0.2 5v455.6c0 2.6 0.2 5.4 0.4 8.2 0.2 2.8 0.6 5.4 1.2 8.2 0.6 2.6 1.2 5.4 2 8 0.8 2.6 1.8 5.2 2.8 7.8 1 2.6 2.2 5 3.6 7.4 1.2 2.4 2.8 4.8 4.2 7.2 1.6 2.2 3.2 4.6 5 6.6a82.42 82.42 0 0 0 11.8 11.8c2.2 1.8 4.4 3.4 6.6 5 2.2 1.6 4.6 3 7.2 4.2 2.4 1.2 5 2.4 7.4 3.6 2.6 1 5.2 2 7.8 2.8 2.6 0.8 5.4 1.4 8 2 2.6 0.6 5.4 1 8.2 1.2 2.8 0.2 5.6 0.4 8.2 0.4H242c18.6 0 33.8 15.2 33.8 33.8s-15.2 33.8-33.8 33.8z"
                p-id="8668"
              ></path>
            </svg>
          </div>
          <span class="tooltiptext">复制代码</span>
        </div>
        <div class="tooltip">
          <div class="icon-wrapper op-btn" @click="sourceVisible = !sourceVisible">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8697">
              <path
                d="M682.666667 810.666667c-12.8 0-21.333333-4.266667-29.866667-12.8-17.066667-17.066667-17.066667-42.666667 0-59.733334l226.133333-226.133333-226.133333-226.133333c-17.066667-17.066667-17.066667-42.666667 0-59.733334s42.666667-17.066667 59.733333 0l256 256c17.066667 17.066667 17.066667 42.666667 0 59.733334l-256 256c-8.533333 8.533333-17.066667 12.8-29.866666 12.8zM341.333333 810.666667c-12.8 0-21.333333-4.266667-29.866666-12.8l-256-256c-17.066667-17.066667-17.066667-42.666667 0-59.733334l256-256c17.066667-17.066667 42.666667-17.066667 59.733333 0s17.066667 42.666667 0 59.733334L145.066667 512l226.133333 226.133333c17.066667 17.066667 17.066667 42.666667 0 59.733334-8.533333 8.533333-17.066667 12.8-29.866667 12.8z"
                p-id="8698"
              ></path>
            </svg>
          </div>
          <span class="tooltiptext">显示源代码</span>
        </div>
      </div>
      <div v-show="sourceVisible" class="collapse-content">
        <sourceCodeVue :source="source" />
      </div>
      <transition v-bind:css="true">
        <div v-show="sourceVisible" class="example-float-control" @click="sourceVisible = !sourceVisible">
          <div class="icon-wrapper">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8636">
              <path
                d="M822.592 678.357333c12.544-12.629333 12.544-33.130667 0-45.76L536.384 345.386667c-6.698667-6.741333-15.573333-9.6-24.384-9.173333-8.768-0.448-17.664 2.410667-24.384 9.173333L201.429333 632.597333c-12.565333 12.629333-12.565333 33.130667 0 45.76s32.981333 12.629333 45.546667 0L512 412.352l265.045333 266.005333C789.632 690.986667 810.005333 690.986667 822.592 678.357333z"
                p-id="8637"
              ></path>
            </svg>
          </div>
          <span>隐藏源代码</span>
        </div>
      </transition>
    </div>

    <!-- 自定义消息提示组件 -->
    <transition name="message-fade">
      <div v-if="messageVisible" class="message" :class="messageType">
        {{ messageContent }}
      </div>
    </transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import exampleVue from './example.vue'
import sourceCodeVue from './source-code.vue'
import { useClipboard } from '@vueuse/core'
import { modules } from '..'
export interface DemoProps {
  path: string
  description: string
  source: string
}
const props = defineProps<DemoProps>()

const sourceVisible = ref(false)
const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.source),
})

const examples = computed(() => {
  let examples: any[] = []
  Object.keys(modules).forEach((key: string) => {
    examples[key.replace('/examples/', '').replace('.vue', '')] = modules[key]
  })
  return examples
})

// 自定义消息组件
const messageTimeout = ref<number | null>(null)
const messageVisible = ref(false)
const messageType = ref('')
const messageContent = ref('')

const showMessage = (type: string, content: string) => {
  // 清除之前的定时器
  if (messageTimeout.value) {
    clearTimeout(messageTimeout.value)
  }

  messageType.value = type
  messageContent.value = content
  messageVisible.value = true

  // 3秒后自动关闭消息
  messageTimeout.value = setTimeout(() => {
    messageVisible.value = false
  }, 3000)
}

async function copyCode() {
  if (!isSupported) {
    showMessage('error', '复制失败')
    return
  }

  try {
    await copy()
    showMessage('success', '复制成功')
  } catch (e: any) {
    showMessage('error', e.message)
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .example {
    background-color: var(--vp-code-block-bg);
    border-color: var(--vp-code-block-bg);
    :deep(.u-fold) {
      color: #ffffff !important;
    }
    .example-float-control {
      background-color: var(--vp-code-block-bg);
    }
  }
}
.example {
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  border-radius: 4px;

  .op-btns {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    line-height: 30px;

    .op-btn {
      margin: 0 10px;
      cursor: pointer;
      transition: 0.2s;
    }

    .icon-wrapper {
      display: inline-flex;
      color: #909399;
      width: 1em;
      height: 1em;
      line-height: 1em;
      text-align: center;

      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }

      &:hover {
        color: #303133;
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    .icon-wrapper {
      display: inline-flex;
      color: inherit;
      width: 1em;
      height: 1em;
      line-height: 1em;
      text-align: center;

      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
    }

    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

/* 自定义tooltip样式 */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 80px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -40px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* 自定义折叠过渡效果 */
.collapse-content {
  transition: all 0.3s ease;
}

/* 自定义消息提示 */
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 9999;
  font-size: 14px;
  transition: opacity 0.3s, transform 0.3s;
}

.message.success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.message.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

/* 消息过渡动画 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 过渡动画 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.divider {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  background-color: #dcdfe6;
}
</style>
