<script lang="ts">
export default {
  name: 'Demo2',
  title: '自定义样式',
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import VueDanmaku from 'vue-danmaku'

const danmus = ref(['这是一条自定义样式的弹幕', '可以设置不同的颜色和样式', '弹幕速度也可以调整'])

const extraStyle = ref({
  color: '#ff6699',
  textShadow: '1px 1px 2px #000',
})
</script>

<template>
  <div>
    <VueDanmaku
      :danmus="danmus"
      :fontSize="22"
      loop
      style="height: 300px"
      :channels="5"
      :speeds="150"
      :extraStyle="extraStyle"
      :autoplay="true"
    />
  </div>
</template>
