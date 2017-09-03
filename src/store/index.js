import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
// import localforage from 'localforage'
import user from './modules/user'
import post from './modules/post'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'billeplume_store',
  storage: window.localStorage
})

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    post
  },
  plugins: [vuexLocalStorage.plugin],
  strict: debug
})
