import Vue from 'vue'
import store from './store'
import app from './app'
import router from './router'
import * as filters from './utils/filters'
import * as directives from './utils/directives'

Vue.config.productionTip = false

for (let f in filters) {
  Vue.filter(f, filters[f])
}

for (let d in directives) {
  Vue.directive(d, directives[d])
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(app)
})
