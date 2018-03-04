<template>
  <div id="app">
    <div class="container">
      <vue-danmaku ref="danmaku" class="dan" :danmus="danmus" :config="config" @inited="onInit">
        <img src="@/assets/mai.png">
      </vue-danmaku>
      <button @click="make(1)">开始</button>
      <button @click="make(2)">暂停</button>
      <button @click="make(3)">停止</button>
    </div>
  </div>
</template>

<script>
import Stats from 'stats.js'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

function animate () {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

export default {
  name: 'App',
  data () {
    return {
      config: {
        channels: 5,
        loop: true
      },
      danmus: [
        '1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试end',
        '2短弹幕测试',
        '3超长弹幕测试',
        '4超长弹幕测试超长弹幕测试超长弹幕测试2',
        '5今天是个好日子',
        '6danmaku最高！',
        '7哔哩哔哩，干杯~',
        '8宽度',
        '9窄'
      ],
      danmus1: [
        '1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试end',
        '2短弹幕测试',
        '3超长弹幕测试',
        '4超长弹幕测试超长弹幕测试超长弹幕测试2',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7bilibili，干杯~',
        '8宽度',
        '9窄'
      ]
    }
  },
  methods: {
    onInit () {
      // this.$refs.danmaku.draw()
    },
    make (index) {
      switch (index) {
        case 1:
          this.$refs.danmaku.draw()
          break
        case 2:
          // this.$refs.danmaku.stop()
          break
        case 3:
          this.$refs.danmaku.stop()
          break
        default:break
      }
    }
  }
}
</script>

<style lang="postcss">
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  background: grey;
  .container {
    margin: 0 20%;
  }
  .dan {
    width: 720px;
    height: 480px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
