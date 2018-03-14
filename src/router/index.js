import Vue from 'vue'
import Router from 'vue-router'
import Rectangles from '@/components/rectangles/Rectangles'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: Rectangles
    }
  ]
})
