# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
![npm download](https://img.shields.io/npm/dm/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()
[![views](https://us-central1-trackgit-analytics.cloudfunctions.net/token/ping/l2vhhsgs5ei8uo1hftsl)](https://trackgit.com)

> A Danmaku component based on Vue.js

English | [简体中文](https://github.com/hellodigua/vue-danmaku/blob/master/README.md)

Demo： [https://hellodigua.github.io/vue-danmaku](https://hellodigua.github.io/vue-danmaku)

Live Demo： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

vue3 supported：[vue3-danmaku](https://github.com/hellodigua/vue-danmaku/tree/vue3)

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue-danmaku --save
```

## Usage

```vue
<template>
  <div>
    <vue-danmaku v-model="danmus" style="height:100px; width:300px;"></vue-danmaku>
  </div>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  components: {
    vueDanmaku,
  },
  data() {
    return {
      danmus: ['danmu1', 'danmu2', 'danmu3', '...'],
    }
  },
}
</script>
```

## Attributes

| Parameters    | Description                                                           | Type    | Optional         | Default |
| :------------ | :-------------------------------------------------------------------- | :------ | :--------------- | :------ |
| v-model       | List of popup elements, support plain text or custom objects          | Array   | String or object | []      |
| channels      | Number                                                                |         | 0                |
| autoplay      | Boolean                                                               |         | true             |
| useSlot       | whether to enable popup slots                                         | Boolean |                  | false   |
| useSlot       | useSlot                                                               | true    |
| fontSize      | The font size of the popup screen (not available in slot mode)        | Number  |                  | 18      |
| extraStyle    | extraStyle (not available in slot mode)                               | String  |                  |         |
| speed         | speed of the popup (number of pixels per second)                      | Number  |                  | 200     |
| debounce      | debounce frequency(ms)                                                | Number  |                  | 100     |
| randomChannel | Randomly select the track to insert                                   | Boolean |                  | false   |
| isSuspend     | Whether or not to enable debounce hover pause (experimental function) | Boolean |                  | false   |
| top           | Vertical Pitch(px)                                                    | Number  |                  | 4       |
| right         | horizontal spacing(px)                                                | Number  |                  | 0       |

- v-model is a new syntax since version 1.5.0, which supports two-way binding of pop-ups.
- If channels is 0, the number of tracks is the maximum number of tracks the container can hold.
- If danmus is empty after initialization, autoplay will be invalidated. So for asynchronously loaded popup data, you need to manually call `this.$refs[refName].play()` to play it.
- The popup refresh frequency is how often the popups are inserted

## Methods

Called via `this.$refs[refName]`

| Method Name  | Description                                                                                | Parameters                               |
| :----------- | :----------------------------------------------------------------------------------------- | :--------------------------------------- |
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

## Event

| Event Name | Description                               | Return Value                        |
| :--------- | :---------------------------------------- | :---------------------------------- |
| list-end   | All pop-ups inserted                      | -                                   |
| play-end   | All popups finished (scrolled off screen) | index (subscript of the last popup) |

## Slot

If you have the need to customize the structure and style of the popup, you can pass in any structure of the object and write your own internal style.

```vue
<template>
  <vue-danmaku ref="danmaku" v-model="danmus" use-slot loop :speeds="200" :channels="5">
    <template slot="dm" slot-scope="{ index, danmu }">
      <div>{{ index }}{{ danmu.name }}：{{ danmu.text }}</div>
    </template>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  data() {
    return {
      danmus: [{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...]
    }
  }
}
</script>
```

## Discuss and exchange and bug feedback

You can also [submit issue](https://github.com/hellodigua/vue-danmaku/issues) to this project

## Tips

- You must set the width and height for the vue-danmaku component to work properly

## License

MIT
