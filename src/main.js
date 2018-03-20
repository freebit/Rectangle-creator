// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VDragged from 'v-dragged'

window.Vue = Vue

const VueGesture = require('vue2-gesture')

Vue.config.productionTip = false
Vue.config.apiUrl = 'http://localhost:8080'

Vue.use(VDragged)
Vue.use(VueGesture)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
