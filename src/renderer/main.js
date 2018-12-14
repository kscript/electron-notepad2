import Vue from 'vue'
import axios from 'axios'
import path from 'path'
import VueCodeMirror from 'vue-codemirror-lite'
import VJstree from 'vue-jstree'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Sortable from 'sortablejs'

import App from './App'
import router from './router'
import store from './store'

import menu from './util/menu.js'
import file from './util/file.js'
import { eventBus } from './eventBus'
import Nano from './util/sql.js'

Vue.prototype.$db = new Nano('store', {
  model: [
    {key: 'id', type: 'int', props: ['pk', 'ai']}, // 自增
    {key: 'receiver_id', type: 'int'}, // 接受者
    {key: 'sender_id', type: 'int'}, // 发送者
    {key: 'status', type: 'int'}, // 处理状态
    {key: 'assign', type: 'int'}, // 分配
    {key: 'show', type: 'int'},
    {key: 'type', type: 'map'}, // 消息类型
    {key: 'time', type: 'int'}, // 首次接受的时间
    {key: 'data', type: 'map'}, // 其它相关数据
    {key: 'more', type: 'map'}, // 更多描述
    {key: 'unread', type: 'int', default: 0}, // 已读条数
    {key: 'count', type: 'int'} // 总条数
  ],
  config: {
    mode: 'PERM', // store changes permenantly
    history: 'row' // store each row's changes as a revision history
  }
})

Vue.use(elementUi)
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
