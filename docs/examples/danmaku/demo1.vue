<script lang="ts">
export default {
  name: 'Demo1',
  title: '基本示例',
}
</script>
<script setup lang="ts">
import VueDanmaku from 'vue-danmaku'
</script>

<template>
  <div>
    <vue-danmaku :danmus="['弹幕', '弹幕', '弹幕']" style="height: 300px" loop :channels="3" autoplay>
      <template #dm="{ danmu, index }"> {{ danmu }} {{ index }} </template>
    </vue-danmaku>
  </div>
</template>
