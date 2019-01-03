import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/common/home').default,
      redirect: 'Editor',
      children: [
        {
          name: 'Editor',
          path: '/Editor',
          component: require('@/components/pages/Editor/index').default
        },
        {
          name: 'Settings',
          path: '/Settings',
          component: require('@/components/pages/Settings/index').default
        },
        {
          name: 'CssSprite',
          path: '/CssSprite',
          component: require('@/components/pages/CssSprite/index').default
        }
      ]
    }
  ]
})
