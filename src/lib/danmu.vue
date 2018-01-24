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
    const danmusEl = this._l(danmus, (danmu, index) => {
      return (
        <p>{danmu}</p>
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
    color: #fff;
    text-shadow: 1px 1px 1px #000;
  }
}
</style>
