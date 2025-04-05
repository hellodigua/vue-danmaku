import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser';
import path from 'path'

let tsconfigOverride = {
  compilerOptions: {
    target: 'ES6',
    lib: ['ES2020', 'dom'],
    rootDir: 'src',
    declarationDir: 'dist/typings',
  },
  include: ['src/lib/**/*'],
}

export default [
  {
    output: {
      format: 'esm',
      file: 'dist/vue-danmaku.esm.js',
    },
    plugins: [
      typescript({ tsconfigOverride, useTsconfigDeclarationDir: true }),
      vue(),
      postcss({
        plugins: [],
      }),
      terser()
    ],
  },
  {
    output: {
      format: 'umd',
      file: 'dist/vue-danmaku.umd.js',
      name: 'VueDanmaku',
      globals: {
        vue: 'Vue',
      },
    },
    plugins: [
      typescript({ tsconfigOverride, useTsconfigDeclarationDir: true }),
      vue({ css: false }),
      postcss({
        minimize: true,
        extract: path.resolve('dist', 'vue-danmaku.css'),
        inject: false,
        plugins: [],
      }),
      terser()
    ],
  },
].map((v) => ({
  ...v,
  input: 'src/lib/Danmaku.vue',
  external: ['vue'],
}))
