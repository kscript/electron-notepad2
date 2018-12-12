import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/pages/Editor/index').default,
      // require('@/components/LandingPage').default,
      //   name: 'index',
      //   component: require('@/components/common/Home').default,
      children: [
        {
          path: '/editor',
          name: 'editor',
          component: require('@/components/pages/Editor/index').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
