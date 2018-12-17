import Vue from 'vue'
import path from 'path'
import electron from 'electron'
import VJstree from 'vue-jstree'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCodeMirror from 'vue-codemirror-lite'
import tool from './util'

import App from './App'
import store from './store'
import router from './router'

Vue.use(VJstree)
Vue.use(tool.eventBus)
Vue.use(elementUi)
Vue.use(VueCodeMirror, {
  events: ['changes']
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// 关闭调试时的electron警告信息
if (window) window.ELECTRON_DISABLE_SECURITY_WARNINGS = true

// let { db, file, menu, copy, eventBus } = tool
Vue.prototype.tool = {
  path,
  electron,
  ...tool
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
