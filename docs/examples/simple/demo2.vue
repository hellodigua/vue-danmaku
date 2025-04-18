<script setup lang="ts">
import VueDanmaku from 'vue-danmaku'
import { ref } from 'vue'

const danmaku = ref<InstanceType<typeof VueDanmaku> | null>(null)

function play() {
  danmaku.value?.play()
}

function pause() {
  danmaku.value?.pause()
}
</script>

<template>
  <div style="height: 300px">
    <vue-danmaku ref="danmaku" :danmus="['弹幕', '弹幕', '弹幕']" loop>
      <template #dm="{ danmu, index }"> {{ danmu }} </template>
    </vue-danmaku>

    <button class="demo-btn" @click="play">播放</button>
    <button class="demo-btn" @click="pause">暂停</button>
  </div>
</template>
