import Vue from 'vue'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror-lite'
import VJstree from 'vue-jstree'
import Sortable from 'sortablejs'

import App from './App'
import router from './router'
import store from './store'
import eventBus from './assets/eventBus'
import file from './assets/file.js'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    let sort = new Sortable(el, binding.value || {})
    return sort
  }
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(eventBus)
Vue.use(VueCodeMirror, {
  events: ['changes']
})
Vue.use(VJstree)
Vue.prototype.$file = file
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
