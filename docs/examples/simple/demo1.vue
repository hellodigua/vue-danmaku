<script setup lang="ts">
import VueDanmaku from 'vue-danmaku'
</script>

<template>
  <div style="height: 300px">
    <vue-danmaku :danmus="['弹幕', '弹幕', '弹幕']" loop>
      <template #danmu="{ danmu }"> {{ danmu }} </template>
    </vue-danmaku>
  </div>
</template>
