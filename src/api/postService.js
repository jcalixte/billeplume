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

  async sync (uid, postsInStore) {
    try {
      let snapshot = await api.database.ref(`user-posts/${uid}`).orderByValue().once('value')
      let postsDb = snapshot.val()
      let posts = await this.synchronize(Object.values(postsDb), postsInStore)
      if (!posts) {
        return []
      }
      posts.sort((a, b) => a.date < b.date)
      return posts
    } catch (error) {
      console.error(error)
    }
  }

  async synchronize (postsInDb, posts) {
    let postsSync = []

    for (let i in posts) {
      let postDb = postsInDb.find(p => p.id === posts[i].id)
      if (postDb) {
        postsSync.push(posts[i].date > postDb.date ? posts[i] : postDb)
      } else {
        try {
          await this.save(posts[i].id, posts[i].uid, posts[i].title, posts[i].content)
          postsSync.push(posts[i])
        } catch (error) {
          console.log(error)
        }
      }
    }
    return postsSync
  }
}

export default new PostService()
