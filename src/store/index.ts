import Vue from 'vue'
import Vuex from 'vuex'
import IArticle from '@/models/IArticle'

Vue.use(Vuex)

interface IState {
  article: IArticle | null
  newServiceWorker: boolean
}

const mainState: IState = {
  article: null,
  newServiceWorker: false
}

const SET_ARTICLE: string = 'SET_ARTICLE'
const NEW_SERVICE_WORKER: string = 'NEW_SERVICE_WORKER'

export default new Vuex.Store<IState>({
  state: mainState,
  getters: {
    article: ({ article }) => article,
    newServiceWorker: ({ newServiceWorker }) => newServiceWorker
  },
  actions: {
    setArticle({ commit }, article: string) {
      commit(SET_ARTICLE, article)
    },
    newServiceWorker({ commit }, newServiceWorker: boolean) {
      commit(NEW_SERVICE_WORKER, newServiceWorker)
    }
  },
  mutations: {
    [SET_ARTICLE](state, article: IArticle) {
      state.article = article
    },
    [NEW_SERVICE_WORKER](state, newServiceWorker: boolean) {
      state.newServiceWorker = newServiceWorker
    }
  }
})
