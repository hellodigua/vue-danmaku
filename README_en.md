# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
![npm download](https://img.shields.io/npm/dm/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> A Vue.js component for danmaku (bullet screen) interaction

[简体中文](https://github.com/hellodigua/vue-danmaku/blob/master/README.md) | English | [日本語](https://github.com/hellodigua/vue-danmaku/blob/vue2/README_jp.md)

Demo: [https://hellodigua.github.io/vue-danmaku](https://hellodigua.github.io/vue-danmaku)

Live Demo: [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

Vue 3 is now supported: [vue3-danmaku](https://github.com/hellodigua/vue-danmaku)

> **Version Note**: v1.7.x is the last version supporting Vue 2. v2.0.0 and above only support Vue 3 and above.

## Preview

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## Install

```bash
$ npm install vue-danmaku@1 --save
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

| Parameter     | Description                                                 | Type    | Options       | Default |
| :------------ | :---------------------------------------------------------- | :------ | :------------ | :------ |
| v-model       | Danmaku element list, supports plain text or custom objects | Array   | String/Object | []      |
| channels      | Number of tracks                                            | Number  |               | 0       |
| autoplay      | Whether to autoplay                                         | Boolean |               | true    |
| useSlot       | Whether to enable danmaku slot                              | Boolean |               | false   |
| loop          | Whether to enable danmaku loop                              | Boolean |               | false   |
| fontSize      | Font size (not available in slot mode)                      | Number  |               | 18      |
| extraStyle    | Additional styles (not available in slot mode)              | String  |               |         |
| speeds        | Danmaku speed (pixels per second)                           | Number  |               | 200     |
| debounce      | Danmaku refresh rate (ms)                                   | Number  |               | 100     |
| randomChannel | Randomly select track for insertion                         | Boolean |               | false   |
| isSuspend     | Enable danmaku hover pause (experimental)                   | Boolean |               | false   |
| top           | Vertical spacing between danmaku (px)                       | Number  |               | 4       |
| right         | Horizontal spacing between danmaku (px)                     | Number  |               | 0       |

- Note 0: v-model is a new syntax since version 1.5.0, supporting two-way binding for danmaku. The old danmus parameter is still supported
- Note 1: When channels is 0, the number of tracks will be the maximum number that the container can accommodate
- Note 2: If danmus is empty after initialization, autoplay will be disabled. For asynchronously loaded danmaku data, you need to manually call `this.$refs[refName].play()` to start playback
- Note 3: Danmaku refresh rate determines how often a new danmaku is inserted

## Built-in Methods

Call through `this.$refs[refName]`

| Method Name  | Description                                                           | Parameters                          |
| :----------- | :-------------------------------------------------------------------- | :---------------------------------- |
| play         | Start/Resume playback                                                 | -                                   |
| pause        | Pause danmaku playback                                                | -                                   |
| stop         | Stop playback and clear danmaku                                       | -                                   |
| show         | Show danmaku                                                          | -                                   |
| hide         | Hide danmaku                                                          | -                                   |
| reset        | Reset configuration                                                   | -                                   |
| resize       | Recalculate scroll distance when container size changes (manual call) | -                                   |
| push         | Send danmaku (append to list end, queued display)                     | danmu data, can be string or object |
| add          | Send danmaku (insert at current position, real-time display)          | danmu data, can be string or object |
| insert       | Draw danmaku (real-time insert, no data binding)                      | danmu data, can be string or object |
| getPlayState | Get current playback state                                            |                                     |

- Note 1: push and add methods return the index after insertion, allowing style customization based on the index
- Note 2: The difference between insert and push/add is that insert doesn't perform data binding but directly inserts DOM, suitable for live streaming scenarios

## Events

| Event Name | Description                                          | Return Value                  |
| :--------- | :--------------------------------------------------- | :---------------------------- |
| list-end   | All danmaku inserted                                 | -                             |
| play-end   | All danmaku playback completed (scrolled off screen) | index (index of last danmaku) |

## Slot

If you need to customize danmaku structure and style, you can pass in objects with any structure and write internal styles.

```vue
<template>
  <vue-danmaku ref="danmaku" v-model="danmus" use-slot loop :speeds="200" :channels="5">
    <!-- Danmaku slot (for vue 2.6.0 and above, you can use v-slot:dm="{ index, danmu }" syntax) -->
    <template slot="dm" slot-scope="{ index, danmu }">
      <div>{{ index }}{{ danmu.name }}: {{ danmu.text }}</div>
    </template>
    <!-- Container slot -->
    <div></div>
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

## Discussion and Bug Reports

This [QA document](https://github.com/hellodigua/vue-danmaku/blob/vue3/QA.md) collects some common questions for reference.

You can also [submit an issue](https://github.com/hellodigua/vue-danmaku/issues) for this project.

## Important Notes

- You must set width and height for the vue-danmaku component to use it properly

## Changelog

### v1.7.3

- Logic optimization

### v1.7.2

- Updated documentation

### v1.7.0

- Optimized resize logic
- fix: Fixed a bug where some iOS15 devices might have screen flashing in built-in app webviews during danmaku initialization

### v1.6.0

- feat: Exposed insert method, allowing direct external danmaku drawing

### v1.5.0

- feat: Added support for v-model two-way binding for danmaku

### v1.4.3

- feat: push and add methods now return insertion index

### v1.4.2

- fix: Fixed a bug where throttle function caused hover suspension to fail when isSuspend was enabled

### v1.4.1

- feat: Added isSuspend parameter (default false), supporting danmaku pause on mouse hover
- fix: Fixed potential screen flashing bug on some iOS15 devices

### v1.4.0

- feat: In loop mode, identical danmaku are not allowed on screen at the same time
- feat: Default color changed to gray

### v1.3.2

- fix: Fixed a bug where add method wouldn't work properly after danmaku playback finished

### v1.3.0

- feat: Removed setChannels, switched to direct control
- feat: Added events for danmaku insertion completion and playback completion
- feat: Added compatibility for when danmaku data is overwritten
- fix: Fixed inaccurate danmaku track number calculation
- fix: Fixed issue where initial danmaku speed update was ineffective

### v1.2.1

- fix: Fixed a bug where danmaku container width might be incorrect during initialization

### v1.2.0

- Changed speed parameter to speeds, with different meaning (primarily to ensure consistent danmaku movement speed across different screens)
  - speed: Total time for danmaku to cross the screen
  - speeds: Pixels per second that danmaku travels

### v1.1.1

- Added extraStyle, allowing control of regular danmaku styles

### v1.1.0

- Added danmaku insertion method

### v1.0.5

- fix: Fixed translation flicker issues on iOS

### v1.0.3

- fix: Fixed a bug where using the default slot would cause errors

### v1.0.0

For ease of use in future versions, component parameters are now passed directly. For previous version documentation, [click here](https://www.npmjs.com/package/vue-danmaku/v/0.3.6)

- Component parameters are now passed directly
- Partial code refactoring

### v0.3.6

- Added support for asynchronous danmaku loading (Note: After async loading, you should manually call the play method)

### v0.3.4

- Added support for random track danmaku sending
- fix: In non-loop mode, danmaku task should not end when playback completes

### v0.3.2

- Added autoplay support
- Recalculating scroll distance when danmaku container size changes

### v0.3.1

- Package size optimization

## License

MIT
