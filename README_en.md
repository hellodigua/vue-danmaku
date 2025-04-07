# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()
[![views](https://us-central1-trackgit-analytics.cloudfunctions.net/token/ping/l2vhhsgs5ei8uo1hftsl)](https://trackgit.com)

> A Danmaku component based on Vue3

English | [简体中文](https://github.com/hellodigua/vue-danmaku/blob/main/README.md)

Live Demo： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue-danmaku --save
```

## Usage

```vue
<template>
  <vue-danmaku v-model:danmus="danmus"></vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  setup(props) {
    const danmus = ref(['danmu1', 'danmu2', 'danmu3', '...'])

    return { danmus }
  },
}
</script>
```

## Attributes

| Parameters    | Description                                                                    | Type    | Optional         | Default |
| :------------ | :----------------------------------------------------------------------------- | :------ | :--------------- | :------ |
| danmus        | List of popup elements, support plain text or custom objects (v-model support) | Array   | String or object | []      |
| channels      | Number of tracks                                                               |         | 0                |
| speed         | speed of the popup (number of pixels per second)                               | Number  |                  | 200     |
| debounce      | debounce frequency(ms)                                                         | Number  |                  | 100     |
| randomChannel | Randomly select the track to insert                                            | Boolean |                  | false   |
| isSuspend     | Whether or not to enable debounce hover pause (experimental function)          | Boolean |                  | false   |
| top           | Vertical Pitch(px)                                                             | Number  |                  | 4       |
| right         | horizontal spacing(px)                                                         | Number  |                  | 0       |

- Since version 1.0.0, the danmus parameter supports v-model:danmus writing to become a two-way binding
- If channels is 0, the number of tracks is the maximum number of tracks the container can hold.
- If danmus is empty after initialization, autoplay will be invalidated. So for asynchronously loaded popup data, you need to manually call `refName.value.play()` to play it.
- The popup refresh frequency is how often the popups are inserted

## Methods

Called via `this.$refs[refName]`

```js
<vue-danmaku ref="danmakuRef"></vue-danmaku>

setup() {
  const danmakuRef = ref(null)

  danmakuRef.value.play()
}
```

| Method Name  | Description                                                                                | Parameters                               |
| :----------- | :----------------------------------------------------------------------------------------- | :--------------------------------------- | ----- |
| play         | start/resume playback                                                                      | -                                        |
| pause        | pause play                                                                                 | -                                        |
| stop         | stop playing and clear the pop-ups                                                         | -                                        |
| show         | show                                                                                       | show                                     |
| hide         | hide                                                                                       | Hide                                     | - - - |
| reset        | reset configuration                                                                        | -                                        |
| resize       | recalculate the scroll distance when the container size is changed (to be called manually) | - -                                      |
| push         | send curtain (inserted at the end of the curtain list, queued)                             | danmu data, can be string or object      |
| add          | send a popup (inserted into the current play position, displayed in real time)             | danmu data, can be a string or an object |
| getPlayState | Get the current play state                                                                 |                                          |

- The return value of push and add is the subscript after insertion, and you can customize the style of the current inserted pop-up by judging the subscript

## Events

| Event Name | Description                                              | Return Value                        |
| :--------- | :------------------------------------------------------- | :---------------------------------- |
| list-end   | All pop-ups inserted                                     | -                                   |
| play-end   | All popups finished (scrolled off screen)                | index (subscript of the last popup) |
| dm-over    | Triggered when entering danmaku with hover pause enabled | Danmaku element object              |
| dm-out     | Triggered when leaving danmaku with hover pause enabled  | Danmaku element object              |
| dm-click   | Triggered when a danmaku is clicked                      | {el, index, danmu, event}           |
| dm-remove  | Triggered when a danmaku is removed                      | {el, index, danmu}                  |
| error      | Triggered when an error occurs                           | {message, code}                     |

## Performance Monitoring

vue-danmaku provides standalone performance monitoring modules that are completely independent from the main component. You can import and use them as needed:

```js
import {
  createFpsMonitor,
  createDanmakuPerformanceMonitor,
  createDanmakuMonitor,
  PERFORMANCE_CONSTANTS,
} from 'vue-danmaku'

// Create FPS monitor
const fpsMonitor = createFpsMonitor(30, (data) => {
  console.log(`FPS dropped to ${data.fps}, below threshold ${data.threshold}`)
})
fpsMonitor.start() // Start monitoring
fpsMonitor.stop() // Stop monitoring

// Create danmaku performance monitor
const performanceMonitor = createDanmakuPerformanceMonitor(100, (data) => {
  console.log(data.message) // Danmaku count exceeded threshold warning
})
performanceMonitor.checkPerformance(110) // Check danmaku count

// Create both FPS and danmaku performance monitors
const monitor = createDanmakuMonitor({
  fpsThreshold: 25,
  warningThreshold: 150,
  onFpsDrop: (data) => console.log(`FPS drop: ${data.fps}`),
  onPerformanceWarning: (data) => console.log(`Performance warning: ${data.message}`),
})
monitor.startAll() // Start all monitoring
monitor.checkDanmakuCount(160) // Check danmaku count
monitor.stopAll() // Stop all monitoring
```

### Using Performance Monitoring with Components

You can use the vue-danmaku component and performance monitoring module together:

```vue
<template>
  <vue-danmaku ref="danmakuRef" v-model:danmus="danmus"></vue-danmaku>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import vueDanmaku, { createDanmakuMonitor } from 'vue-danmaku'

const danmakuRef = ref(null)
const danmus = ref(['danmu1', 'danmu2', 'danmu3'])

// Create performance monitor instance
const monitor = createDanmakuMonitor({
  fpsThreshold: 30,
  warningThreshold: 100,
  onFpsDrop: (data) => {
    console.log(`FPS dropped to ${data.fps}`)
  },
  onPerformanceWarning: (data) => {
    console.log(`Performance warning: ${data.message}`)
  },
})

onMounted(() => {
  // Start performance monitoring
  monitor.startAll()

  // Check performance after adding many danmus
  const addManyDanmus = () => {
    for (let i = 0; i < 150; i++) {
      danmus.value.push(`Lots of danmus ${i}`)
    }
    // Manually check danmu count
    monitor.checkDanmakuCount(danmus.value.length)
  }

  // For example, add many danmus after 5 seconds
  setTimeout(addManyDanmus, 5000)
})

// Stop monitoring when component is destroyed
onUnmounted(() => {
  monitor.stopAll()
})
</script>
```

## Slot

If you have the need to customize the structure and style of the popup, you can pass in any structure of the object and write your own internal style.

```vue
<template>
  <vue-danmaku ref="danmaku" v-model:danmus="danmus" loop :channels="5">
    <template v-slot:dm="{ index, danmu }">
      <span>{{ index }}{{ danmu.name }}：{{ danmu.text }}</span>
    </template>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  setup(props) {
    const danmus = ref([{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...])

    return { danmus }
  },
}
</script>
```

## Discuss and exchange and bug feedback

You can also [submit issue](https://github.com/hellodigua/vue-danmaku/issues) to this project

## Tips

- You must set the width and height for the vue-danmaku component to work properly

## License

MIT
