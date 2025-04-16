import { defineConfig, presetIcons, presetUno, presetWind } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetWind(), presetIcons()],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center',
    },
  ],
})
