import Vue from 'vue'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror-lite'

import App from './App'
import router from './router'
import store from './store'
import eventBus from './assets/eventBus'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(eventBus)
Vue.use(VueCodeMirror)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
