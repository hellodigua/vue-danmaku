<template>
  <div id="app">
    <vue-danmaku class="danmaku" :danmus="danmus">
      <img src="@/assets/mai.png">
    </vue-danmaku>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      danmus: [
        '1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试',
        '2超长弹幕测试超长弹幕测试超长弹幕测试',
        '3超长弹幕测试超长弹幕测试',
        '4超长弹幕测试',
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
  height: 100%;
  width: 100%;
  .danmaku {
    width: 360px;
    height: 240px;
    img {
      width: 100%;
    }
  }
}
</style>
