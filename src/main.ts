import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './styles/index.scss'
import bus, { NEW_SW } from './utils/bus-event'
import filters from './utils/filters'

Vue.config.productionTip = false

bus.$on(NEW_SW, () => {
  // tslint:disable-next-line:no-console
  console.log('New content is available; please refresh.')
  store.dispatch('newServiceWorker', true)
})

for (const filter of Object.keys(filters)) {
  Vue.filter(filter, filters[filter])
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
