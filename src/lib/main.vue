<template>
  <div class="barrage" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
    <div class="danmus"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueDanmu from './danmu.vue'
export default {
  props: {
    danmus: {
      type: Array,
      required: true
    },
    row: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      isActive: false,
      timer: null,
      danmu: null
    }
  },
  computed: {},
  watch: {
    isActive (val) {
      val ? this.start() : this.stop()
    }
  },
  created () { },
  mounted () { },
  methods: {
    initDanmu () {
      this.danmu = new Vue(VueDanmu).$mount('.danmus')
      this.danmu.danmus = this.danmus
    },
    onMouseenter () {
      this.isActive = true
    },
    onMouseleave () {
      this.isActive = false
    },
    start () {
      this.initDanmu()
    },
    stop () {
    }
  }
}
</script>
<style lang="postcss" scoped>
.barrage {
  position: relative;
}
</style>
