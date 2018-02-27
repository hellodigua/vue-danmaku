<script>
export default {
  props: {},
  data () {
    return {
      danmus: null
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  render (h) {
    const {
      danmus
    } = this
    const danmusEl = this._l(danmus, (item) => {
      return (
        <p
          class='dm'
          ref={`dm-${item.index}`}
        >
          {item.danmu}
        </p>
      )
    })
    return (
      <div class="danmus show">
        {danmusEl}
      </div>
    )
  },
  methods: {
  }
}
</script>
<style lang="postcss" scoped>
.danmus {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  &.show {
    opacity: 1;
  }
  p {
    position: absolute;
    color: #fff;
    text-shadow: 1px 1px 1px #000;
    margin: 0;
    white-space: pre;
  }
  .dm {
    position: absolute;
    color: #fff;
    font-size: 18px;
    left: 100%;
    top: 8px;
    white-space: pre;
    text-shadow: 1px 1px 2px #001;
  }
}
</style>
