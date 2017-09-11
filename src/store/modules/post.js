import * as types from '../mutation-types'
import postService from '@/api/postService'

const state = {
  posts: [],
  currentPostId: null
}

const getters = {
  posts: state => state.posts,
  currentPostId: state => state.currentPostId
}

const actions = {
  async syncPosts ({ commit, state }, userId) {
    try {
      if (navigator.onLine) {
        let posts = await postService.sync(userId, state.posts)
        if (posts && posts.length) {
          commit(types.SYNC_POST, { posts })
        }
      }
    } catch (error) {
      console.info(error)
    }
  },
  async newPost ({ commit }, uid) {
    let postKey = await postService.add(uid)
    let post = {
      id: postKey,
      uid: uid,
      title: '',
      content: '',
      date: Date.now()
    }
    commit(types.ADD_POST, { post })
    return post
  },
  async addPost ({ commit }, uid) {
    let post = {
      uid: uid,
      title: '',
      content: '',
      date: Date.now()
    }
    let postKey = await postService.add(post.uid, post.title, post.content)
    post.id = postKey
    commit(types.ADD_POST, { post })
    return post
  },
  async removePost ({ commit }, { uid, id }) {
    await postService.remove(uid, id)
    commit(types.REMOVE_POST, { id })
  },
  updatePost ({ commit }, post) {
    if (post) {
      let postUpdated = post
      postUpdated.date = Date.now()
      try {
        postService.save(post.id, post.uid, post.title, post.content, postUpdated.date)
      } catch (error) {
        console.log(error)
      }
      commit(types.UPDATE_POST, { post: postUpdated })
    }
  },
  setCurrentPostId ({ commit }, id) {
    commit(types.SET_CURRENT_POST_ID, { id })
  },
  resetCurrentPost ({ commit }) {
    commit(types.RESET_CURRENT_POST)
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
        state.posts.sort((a, b) => a.date < b.date)
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
        for (let j in post) {
          state.posts[i][j] = post[j]
        }
      }
    }
  },
  [types.SET_CURRENT_POST_ID] (state, { id }) {
    let post = state.posts.find(p => p.id === id)
    if (post) {
      state.currentPostId = id
    }
  },
  [types.RESET_CURRENT_POST] (state) {
    state.currentPostId = null
  },
  [types.RESET_POST] (state) {
    state.currentPostId = null
    state.posts = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
