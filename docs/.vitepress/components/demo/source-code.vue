<template>
  <div class="example-code language-vue relative">
    <div v-html="highlightedSource"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import vue from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/atom-one-dark.css'

// 注册Vue语言
hljs.registerLanguage('vue', vue)

interface Props {
  source: string
}
const props = defineProps<Props>()
const highlightedSource = ref('')

onMounted(() => {
  try {
    const decodedSource = decodeURIComponent(props.source)
    const highlighted = hljs.highlight(decodedSource, { language: 'vue' }).value
    highlightedSource.value = `<pre class="hljs"><code>${highlighted}</code></pre>`
  } catch (error) {
    console.error('高亮处理错误:', error)
    // 如果高亮失败，至少显示原始代码
    const decodedSource = decodeURIComponent(props.source)
    highlightedSource.value = `<pre><code>${decodedSource}</code></pre>`
  }
})
</script>

<style lang="scss">
.dark {
  pre {
    margin: 0;
  }
  pre code.hljs {
    background-color: var(--vp-code-block-bg);
  }
}

.active-code {
  color: var(--c-brand);
}

.example-code {
  margin: 0 auto !important;
  width: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.01;
}
.fade-enter-active {
  transition: opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.fade-leave-active {
  transition: opacity 250ms linear;
}
</style>
