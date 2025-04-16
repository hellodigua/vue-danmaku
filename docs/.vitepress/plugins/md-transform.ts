import path from 'path'
import klawSync from 'klaw-sync'

import type { Plugin } from 'vite'

const DEMO_PATH = path.resolve(__dirname, '../../../demo')

const components = klawSync(DEMO_PATH, {
  nofile: true,
  depthLimit: 0,
}).map((dir) => path.basename(dir.path))

export function MarkdownTransform(): Plugin {
  return {
    name: 'md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return

      const componentId = path.basename(id, '.md')

      if (!components.includes(componentId)) return

      const append = {
        headers: [],
        footers: [],
        scriptSetups: [`const demos = import.meta.glob('../../../demo/${componentId}/demo*.vue')`],
      }

      code += `
<script setup>
${append.scriptSetups}
</script>
`

      return {
        code,
      }
    },
  }
}
