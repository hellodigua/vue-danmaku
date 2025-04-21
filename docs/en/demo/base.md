# Base

## 弹幕悬浮暂停

开启 `isSuspend` 属性实现鼠标悬浮在弹幕上时暂停滚动的效果。

```vue
<template>
  <vue-danmaku
    v-model:danmus="danmus"
    :isSuspend="true"
    style="height: 150px;"
    @dm-over="onDanmuOver"
    @dm-out="onDanmuOut"
  />
</template>

<script setup>
import { ref } from 'vue'
import vueDanmaku from 'vue-danmaku'

const danmus = ref(['悬浮暂停弹幕1', '悬浮暂停弹幕2', '悬浮暂停弹幕3'])

const onDanmuOver = (el) => {
  console.log('鼠标进入弹幕', el)
}

const onDanmuOut = (el) => {
  console.log('鼠标离开弹幕', el)
}
</script>
```
