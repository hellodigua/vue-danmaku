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
        '超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试',
        '超长弹幕测试超长弹幕测试超长弹幕测试',
        '超长弹幕测试超长弹幕测试',
        '超长弹幕测试',
        '今天是个好日子',
        'danmaku最高！',
        '地瓜地瓜，干杯~',
        '宽度',
        '窄'
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
