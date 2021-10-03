const { createVuePlugin } = require('vite-plugin-vue2');
import Components from 'unplugin-vue-components/vite'
const path = require("path");

console.log(path.resolve(__dirname, './src/'));

export default {
     plugins: [ createVuePlugin(), Components({ transformer: "vue2", include: [/\.vue$/, /\.vue\?vue/, /\.md$/] })],
     build : {
          outDir : "./public/index.html"
     },
     server : {
          port : 8000,
          proxy : {
               '/api' : 'http://localhost:5000/api'
          }
     },
     resolve : {
          alias : {
               '@' : path.resolve(__dirname, './src'),
               'vue$': 'vue/dist/vue.esm.js' //No I18N
          },
          extensions: ['*', '.js', '.vue', '.json']
     }
}