import * as types from '../mutation-types'
import postService from '@/api/postService'

const state = {
  posts: [],
  currentPostId: null,
  currentPost: null,
  currentPostIndex: null
}

const getters = {
  posts: state => state.posts,
  currentPostId: state => state.currentPostId,
  currentPost: state => state.currentPost,
  currentPostIndex: state => state.currentPostIndex
}

const actions = {
  async syncPosts ({ commit, state }, userId) {
    try {
      if (navigator.onLine) {
        let posts = await postService.sync(userId)
        if (posts && posts.length) {
          commit(types.SYNC_POST, { posts })
          commit(types.SET_CURRENT_POST, { index: 0 })
        }
      }
    } catch (error) {
      console.info(error)
    }
  },
  async newPost ({ commit, state }, uid) {
    let postKey = await postService.add(uid)
    let post = {
      id: postKey,
      uid: uid,
      title: '',
      content: '',
      date: Date.now()
    }
    commit(types.ADD_POST, { post })
    let index = state.posts.findIndex(p => p.id === post.id)
    commit(types.SET_CURRENT_POST, { index })
  },
  async addPost ({ commit }, post) {
    let postKey = await postService.add(post.uid, post.title, post.content)
    post.id = postKey
    commit(types.ADD_POST, { post })
  },
  async removePost ({ commit }, { uid, id }) {
    await postService.remove(uid, id)
    commit(types.REMOVE_POST, { id })
  },
  async updatePost ({ commit, state }, post) {
    if (post) {
      let postUpdated = await postService.save(post.id, post.uid, post.title, post.content)
      commit(types.UPDATE_POST, { post: postUpdated })
    }
  },
  setCurrentPost ({ commit, state }, id) {
    let index = state.posts.findIndex(p => p.id === id)
    if (index >= 0) {
      commit(types.SET_CURRENT_POST, { index })
    } else {
      console.warn('index non trouvé')
    }
  },
  resetPost ({ commit }) {
    commit(types.RESET_POST)
  }
}

const mutations = {
  [types.SYNC_POST] (state, { posts }) {
    if (posts) {
      state.posts = posts
    }
  },
  [types.ADD_POST] (state, { post }) {
    if (post) {
      let i = state.posts.findIndex(p => p.id === post.id)
      if (i < 0) {
        state.posts.push(post)
      } else {
        console.error(`Le billet ${post.id} existe déjà.`)
      }
    }
  },
  [types.REMOVE_POST] (state, { id }) {
    if (id) {
      state.posts = state.posts.filter(p => p.id !== id)
      if (state.currentPost && state.currentPost.id === id) {
        state.currentPostIndex = 0
        state.currentPost = state.posts[state.currentPostIndex]
      }
    }
  },
  [types.UPDATE_POST] (state, { post }) {
    if (post) {
      let i = state.posts.findIndex(p => p.id === post.id)
      if (i >= 0) {
        state.posts[i] = post
      }
    }
  },
  [types.SET_CURRENT_POST] (state, { index }) {
    if (state.posts && state.posts.length && state.posts[index]) {
      state.currentPost = state.posts[index]
    }
  },
  [types.RESET_POST] (state) {
    state.currentPostIndex = null
    state.currentPost = null
    state.posts = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
