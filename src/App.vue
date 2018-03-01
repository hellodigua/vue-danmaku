<template>
  <div id="app">
    <vue-danmaku class="danmaku" :danmus="danmus1" :config="config">
      <img src="@/assets/mai.png">
    </vue-danmaku>
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
        channels: 0,
        loop: true
      },
      danmus: [
        '1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试end',
        '2超长弹幕测试超长弹幕测试超长弹幕测试2',
        '3短弹幕测试',
        '4超长弹幕测试',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '9窄'
      ],
      danmus1: [
        '1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试end',
        '2超长弹幕测试超长弹幕测试超长弹幕测试2',
        '3短弹幕测试',
        '4超长弹幕测试',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '5今天是个好日子',
        '6danmaku最高！',
        '7地瓜地瓜，干杯~',
        '8宽度',
        '9窄'
      ]
    }
  }
}
</script>

<style lang="postcss">
#app {
  height: 100vh;
  width: 100vw;
  background: grey;
  padding: 100px;
  .danmaku {
    width: 720px;
    height: 480px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
