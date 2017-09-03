import api from './'

class PostService {
  async add (uid, title = '', content = '') {
    try {
      if (!uid) {
        console.error('ui non défini')
        return
      }
      let ref = api.database.ref(`user-posts/${uid}`)
      let key = ref.push().key
      await ref.child(key).set({
        id: key,
        title: title,
        uid: uid,
        content: content,
        date: Date.now()
      })
      return key
    } catch (error) {
      console.error(error)
    }
  }

  async save (id, uid, title, content) {
    try {
      let post = {
        id: id,
        title: title,
        uid: uid,
        content: content,
        date: Date.now()
      }
      await api.database.ref(`user-posts/${uid}/${id}`).set(post)
      return post
    } catch (error) {
      console.error(error)
    }
  }

  async remove (uid, id) {
    try {
      await api.database.ref(`user-posts/${uid}/${id}`).remove()
    } catch (error) {
      console.error(error)
    }
  }

  async sync (uid) {
    try {
      let snapshot = await api.database.ref(`user-posts/${uid}`).orderByValue().once('value')
      let postsDb = snapshot.val()
      let posts = Object.values(postsDb)
      if (!posts) {
        return []
      }
      posts.sort((a, b) => a.date < b.date)
      return posts
    } catch (error) {
      console.error(error)
    }
  }
}

export default new PostService()
