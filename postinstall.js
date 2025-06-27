try {
  const message = `
\x1b[33m+-----------------------------------------------------------------------------+
|  废弃警告：                                                                   |
|  感谢您使用 vue3-danmaku，该包即将废弃，请安装 vue-danmaku 以替代 vue3-danmaku。  |
|  新的包进行了一些重大更新，包含对海量弹幕场景的性能优化、解决移动端兼容问题、以及新的API等。|
|  请前往 https://www.npmjs.com/package/vue-danmaku 查看详情并更新。               |
+------------------------------------------------------------------------------+\x1b[0m
  `;

  // 使用process.stdout直接输出，确保即使在npm安装过程中也会显示
  process.stdout.write(message + '\n');
  console.log('\x1b[31m%s\x1b[0m', '警告: vue3-danmaku 已废弃，请使用 vue-danmaku 替代！');

} catch (error) {
  process.stderr.write(`Postinstall warning display failed: ${error}\n`);
}