<template>
  <div>23</div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from 'vue'

export default defineComponent({
  name: 'VueDanmaku',
  components: {},
  props: {
    danmus: Array,
  },
  setup(props) {
    const { danmus } = toRefs(props)
    let timer

    function init() {
      initCore()
      initConfig()
      play()
    }

    function initCore() {}

    function initConfig() {}

    function play() {
      draw()
    }
    function draw() {
      timer = setInterval(() => {})
    }

    init()
    return {}
  },
})
</script>
<style lang="scss" scoped></style>
