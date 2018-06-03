<template>
  <div id="app">
    <vue-danmaku ref="danmaku" class="dan" :danmus="danmus" :config="config" @inited="onInit" @mouseIn="onMouseIn" @mouseOut="onMouseOut">
      <img src="../static/mai.png">
    </vue-danmaku>
    <button @click="make(1)">开始</button>
    <button @click="make(2)">暂停</button>
    <button @click="make(3)">停止</button>
    <button @click="make(4)">显示</button>
    <button @click="make(5)">隐藏</button>
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
  components: {
  },
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
      this.$refs.danmaku.play()
    },
    onMouseIn () {
      console.log('in')
    },
    onMouseOut () {
      console.log('out')
    },
    make (index) {
      switch (index) {
        case 1:
          this.$refs.danmaku.play()
          break
        case 2:
          this.$refs.danmaku.pause()
          break
        case 3:
          this.$refs.danmaku.stop()
          break
        case 4:
          this.$refs.danmaku.show()
          break
        case 5:
          this.$refs.danmaku.hide()
          break
        default: break
      }
    }
  }
}
</script>

<style lang="scss">
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