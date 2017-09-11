import { SYNC_USER, CLEAR_USER, SAVE_BACKGROUND, SAVE_FONT, SAVE_MUSIC } from '../mutation-types'
import userService from '@/api/userService'

const state = {
  user: null,
  background: null,
  font: null,
  music: null
}

const getters = {
  user: state => state.user,
  preference: state => {
    return {
      background: state.background,
      font: state.font,
      music: state.music
    }
  }
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
  },
  saveBackGround ({ commit }, background) {
    commit(SAVE_BACKGROUND, { background })
  },
  saveFont ({ commit }, font) {
    commit(SAVE_FONT, { font })
  },
  saveMusic ({ commit }, music) {
    commit(SAVE_MUSIC, { music })
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
  },
  [SAVE_BACKGROUND] (state, { background }) {
    state.background = background
  },
  [SAVE_FONT] (state, { font }) {
    state.font = font
  },
  [SAVE_MUSIC] (state, { music }) {
    state.music = music
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
