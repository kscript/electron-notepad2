import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/common/Home.vue').default,
      children: [
        {
          path: '/editor',
          name: 'editor',
          component: require('@/components/pages/Editor/index.vue').default
        }
      ]
    }
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
