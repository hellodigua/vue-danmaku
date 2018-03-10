<template>
  <div id="app">
    <vue-danmaku ref="danmaku" class="dan" :danmus="danmus" :config="config" @inited="onInit">
      </vue-danmaku>
  </div>
</template>

<script>
import VueDanmaku from './lib/index'
export default {
  name: 'App',
  components: {
    VueDanmaku
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
      this.$refs.danmaku.draw()
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