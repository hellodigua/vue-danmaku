import { createServer } from 'vitepress'
import { createLogger } from 'vite'
import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'

const logger = createLogger('info', { prefix: 'seed' })

async function devDocs() {
  const server = await createServer('docs', {
    host: true,
    port: 3080,
  })

  await server.listen()

  const url = `http://localhost:3080/`

  logger.info(`Server is listening at ${url}`)
  logger.info(`Server is ready. Copy docs...`)
  docsChangeWatcher()

  // 监听服务器关闭事件
  server.httpServer?.on('close', () => {
    logger.info('Server closed')
  })
}

devDocs()

function docsChangeWatcher() {
  const src = path.resolve(process.cwd(), 'demo')

  // 确保将 chokidar.watch() 的返回值显式类型化为 chokidar.FSWatcher
  const watcher = chokidar.watch(src, {
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
  }) as chokidar.FSWatcher

  watcher.on('all', (_: string, filePath: string) => {
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
