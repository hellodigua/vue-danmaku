# 快速开始

## 安装

```bash
npm install vue-danmaku --save
```

## 使用

```vue
<template>
  <vue-danmaku v-model:danmus="danmus" style="height: 100px;">
    <template #dm="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
    </template>
  </vue-danmaku>
</template>

<script setup>
import vueDanmaku from 'vue-danmaku'

const danmus = ref([{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...])
</script>
```
