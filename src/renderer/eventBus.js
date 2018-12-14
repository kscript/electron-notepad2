import Vue from 'vue'
export let Bus = new Vue({
  data () {
    return {
      evs: []
    }
  }
})
export let eventBus = {
  install () {
    Vue.prototype.$bus = Bus
  }
}
export default {
  Bus,
  eventBus
}
