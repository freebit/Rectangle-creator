import Vue from 'vue'
import Router from 'vue-router'
import Desktop from '@/components/desktop/Desktop.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: Desktop
    }
  ]
})
