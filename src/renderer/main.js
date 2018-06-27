import Vue from 'vue'
import axios from 'axios'
import path from 'path'
import VueCodeMirror from 'vue-codemirror-lite'
import VJstree from 'vue-jstree'
// import Sortable from 'sortablejs'

import App from './App'
import router from './router'
import store from './store'

import menu from './assets/menu.js'
import { eventBus } from './assets/eventBus'
import file from './assets/file.js'
import Sortable from 'vue-sortable'
Vue.use(Sortable)
Vue.use(eventBus)
Vue.use(VueCodeMirror, {
  events: ['changes']
})
Vue.use(VJstree)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$menu = menu
Vue.prototype.$file = file
Vue.prototype.$path = path
Vue.prototype.$copy = function (data) {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (e) {
    console.log('复制失败', e)
    return data
  }
}
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
