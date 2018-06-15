import Vue from 'vue'
export let eventBus = {
  install () {
    Vue.prototype.$bus = new Vue({
      data () {
        return {
          evs: []
        }
      }
    })
  }
}
export default {
  eventBus
}
