export function submitCodepen(
  data: {
    template: string
    script: string
    styles: string
  },
  {
    link = '',
    css = '',
    name = '',
  }: {
    link?: string
    css?: string
    name?: string
  }
) {
  const resourcesTpl = `
<script src="//unpkg.com/vue@next"><\/script>
<script src="${link}"><\/script>
  `

  const htmlTpl = `
${resourcesTpl}
<div id="app">
${decodeURIComponent(data.template)}
</div>
    `
  const cssTpl = `
@import url("${css}");
${(decodeURIComponent(data.styles) || '').trim()}
  `
  let jsTpl = data.script
    ? decodeURIComponent(data.script)
        .replace(/export default/, 'var Main =')
        .trim()
        .replace(
          /import ({.*}) from \\?("|')vue\\?("|')/g,
          (s, s1) => `const ${s1} = Vue`
        )
        .replace(
          /import {?.*}? from \\?("|')${name}\/(\w+-?\w+)\\?("|')(;?)/g,
          (s, s1, s2) =>
            `const {${s2
              .replace(/\w/, (s: any) => s.toUpperCase())
              .replace(/-(\w)/, (s: any, s1: string) =>
                s1.toUpperCase()
              )}} = ${name}`
        )
    : 'var Main = {}'
  jsTpl += `
;const app = Vue.createApp(Main);
app.use(${name});
app.mount("#app")
  `

  const payload = {
    js: jsTpl,
    css: cssTpl,
    html: htmlTpl,
  }
  const form = document.createElement('form')

  form.method = 'POST'
  form.action = 'https://codepen.io/pen/define/'
  form.target = '_blank'
  form.style.display = 'none'

  const input = document.createElement('input')
  input.setAttribute('name', 'data')
  input.setAttribute('type', 'hidden')
  input.setAttribute('value', JSON.stringify(payload))

  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
