import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import path from 'path'

let tsconfigOverride = {
  compilerOptions: {
    target: 'ES6',
    lib: ['ES2020', 'dom'],
    rootDir: 'src',
    declarationDir: "dist/types"
  },
  include: ['src/**/*'],
}

export default [
  {
    output: {
      format: 'esm',
      file: 'dist/vue3-danmaku.esm.js',
    },
    plugins: [
      typescript({ tsconfigOverride, useTsconfigDeclarationDir: true }),
      vue(),
      postcss({
        plugins: [],
      }),
    ],
  },
  {
    output: {
      format: 'cjs',
      file: 'dist/vue3-danmaku.cjs.js',
      exports: 'default',
    },
    plugins: [
      typescript({ tsconfigOverride, useTsconfigDeclarationDir: true }),
      vue({ css: false }),
      postcss({
        extract: path.resolve('dist', 'vue3-danmaku.css'),
        inject: false,
        plugins: [],
      }),
    ],
  },
].map((v) => ({
  ...v,
  input: 'src/lib/Danmaku.vue',
  external: ['vue'],
}))
