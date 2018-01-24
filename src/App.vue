<template>
  <div id="app">
    <vue-barrage class="barrage" :danmus="danmus">
      <img src="@/assets/mai.png">
    </vue-barrage>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      danmus: [
        '2333333333333',
        '今天是个好日子',
        'barrage最高！',
        '地瓜地瓜，干杯~'
      ]
    }
  }
}
</script>

<style lang="postcss">
#app {
  height: 100%;
  width: 100%;
  .barrage {
    width: 360px;
    height: 240px;
    img {
      width: 100%;
    }
  }
}
</style>
