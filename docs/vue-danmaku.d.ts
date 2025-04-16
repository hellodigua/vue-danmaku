declare module 'vue-danmaku' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    danmus: { type: Array; default: () => [] }
    fontSize: { type: Number; default: 18 }
    channels: { type: Number; default: 0 }
    autoplay: { type: Boolean; default: true }
    useSlot: { type: Boolean; default: false }
    debounce: { type: Number; default: 100 }
    speeds: { type: Number; default: 200 }
    randomChannel: { type: Boolean; default: true }
    extraStyle: { type: Object; default: () => {} }
    isSuspend: { type: Boolean; default: false }
    repeat: { type: Boolean; default: false }
    [key: string]: any
  }>
  export default component
}
