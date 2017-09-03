import { SYNC_USER, CLEAR_USER } from '../mutation-types'
import userService from '@/api/userService'

const state = {
  user: null
}

const getters = {
  user: state => state.user
}

const actions = {
  async login ({ commit }, user) {
    let u = await userService.login(user.email, user.password)
    commit(SYNC_USER, { user: u })
    return u
  },
  async register ({ commit }, user) {
    await userService.register(user.email, user.password)
    commit(SYNC_USER, { user })
  },
  async logout ({ commit, state }) {
    if (state.user) {
      await userService.logout()
      commit(CLEAR_USER)
    }
  }
}

const mutations = {
  [SYNC_USER] (state, { user }) {
    if (user) {
      delete user.password
      state.user = user
    }
  },
  [CLEAR_USER] (state) {
    if (state.user) {
      state.user = null
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
