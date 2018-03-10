// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  // 环境定义了预定义的全局变量。
  "env": {
    //环境定义了预定义的全局变量。更多在官网查看
    // "node": true,
    // "commonjs": true,
    // "amd": true,
    // "es6": true,
    // "mocha": true
    "browser": true
  },
  // JavaScript 语言选项
  "parserOptions": {
    "sourceType": "module" //module、script
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: "standard",
  //npm install --save-dev eslint-config-vue eslint-plugin-vue
  //https://github.com/vuejs/eslint-config-vue
  // extends: "vue",
  // 全局变量: 定义全局变量后，ESLint不会警告"
  globals: { "_initBaiduMap": true, "expect": true, "Vue": true },
  // required to lint *.vue files
  plugins: ["html", "vue"],
  /**
   *  "off" 或 0 - 关闭规则
   *  "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   *  "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  "rules": {
    // 要求箭头函数的参数使用圆括号
    "arrow-parens": 2,
    // 要求在注释周围有空行( 要求在块级注释之前有一空行)
    "lines-around-comment": [1, {
      "beforeBlockComment": true
    }],
    // 强制 generator 函数中 * 号周围使用一致的空格
    "generator-star-spacing": [2, {
      "before": true,
      "after": true
    }],
    // 强制在 function的左括号之前使用一致的空格
    "space-before-function-paren": [0, "always"],
    // 允许构造函数首字母非大写
    "new-cap": 0,
    // 允许开发过程使用debugger
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  }
}
