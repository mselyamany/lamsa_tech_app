const esbuild = require('esbuild')
const path = require('path')
const vuePlugin = require('esbuild-plugin-vue3')

const rootOfApp = __dirname // path.join(__dirname, '../lamsa_tech_app/lamsa_tech_app/lamsatech_query_dialog')

esbuild.build({
  minify: true,

  entryPoints: [path.join(rootOfApp, 'app/main.ts')],
  bundle: true,
  outfile: path.join(rootOfApp, 'dist/app.js'),
  plugins: [vuePlugin()]
})