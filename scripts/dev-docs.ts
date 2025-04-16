import { createServer } from 'vitepress'
import { createLogger } from 'vite'
import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'

const logger = createLogger('info', {
  prefix: 'seed',
})

async function devDocs() {
  const server = await createServer('docs', {
    host: true,
    port: 3080,
  })

  await server.listen()

  server.watcher.on('ready', () => {
    logger.info(`\nServer is ready. Copy docs... \n`)
    logger.info(`${'http://localhost:3080/'} \n`)
    docsChangeWatcher()
  })
}

devDocs()

function docsChangeWatcher() {
  const src = path.resolve(process.cwd(), 'demo')

  chokidar
    .watch(src, {
      ignored(path: string) {
        return (
          path.endsWith('.js') ||
          path.endsWith('.vue') ||
          path.endsWith('.ts') ||
          path.endsWith('.styl') ||
          path.endsWith('.css')
        )
      },
      ignoreInitial: true,
    })
    .on('all', (_: string, filePath: string) => {
      const componentName = path.basename(path.dirname(filePath))

      const copyFile = (lang: string) => {
        const descFile = path.resolve(process.cwd(), `docs/${lang}/components`, path.basename(componentName) + '.md')
        fs.mkdirSync(path.dirname(descFile), {
          recursive: true,
        })
        fs.copyFileSync(filePath, descFile)
      }

      if (path.basename(filePath) === 'README.md') {
        copyFile('en-US')
      } else if (path.basename(filePath) === 'README.zh-CN.md') {
        copyFile('zh-CN')
      }
    })
}
