import api from './'
import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

class PostService {
  async add (uid, title = '', content = '', date = Date.now()) {
    try {
      bus.$emit(LOADING, 'add-post')
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
        date: date
      })
      bus.$emit(FINISHED, 'add-post')
      return key
    } catch (error) {
      console.error(error)
    }
  }

  async save (id, uid, title, content, date = Date.now()) {
    try {
      bus.$emit(LOADING, 'save-post')
      let post = {
        id: id,
        title: title,
        uid: uid,
        content: content,
        date: date
      }
      let snapshot = await api.database.ref(`user-posts/${uid}/${id}`).once('value')
      let postInDb = snapshot.val()
      if (!postInDb) {
        let key = await this.add(post.uid, post.title, post.content, post.date)
        post.id = key
      } else if (postInDb.date < post.date) {
        await api.database.ref(`user-posts/${uid}/${id}`).set(post)
      }
      bus.$emit(FINISHED, 'save-post')
      return post
    } catch (error) {
      console.error(error)
    }
  }

  async remove (uid, id) {
    try {
      bus.$emit(LOADING, 'remove-post')
      await api.database.ref(`user-posts/${uid}/${id}`).remove()
      bus.$emit(FINISHED, 'remove-post')
    } catch (error) {
      console.error(error)
    }
  }

  async sync (uid, postsInStore) {
    try {
      bus.$emit(LOADING, 'sync-post')
      let snapshot = await api.database.ref(`user-posts/${uid}`).orderByValue().once('value')
      let postsDb = snapshot.val()
      let posts = await this.synchronize(Object.values(postsDb), postsInStore)
      if (!posts) {
        return []
      }
      posts.sort((a, b) => a.date < b.date)
      bus.$emit(FINISHED, 'sync-post')
      return posts
    } catch (error) {
      console.error(error)
    }
  }

  async synchronize (postsDb, posts) {
    let postsSync = []

    if (posts && posts.length) {
      for (let i in posts) {
        let postDb = postsDb.find(p => p.id === posts[i].id)
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
    }

    if (postsDb && postsDb.length) {
      for (let i in postsDb) {
        let postStore = posts.find(p => p.id === postsDb[i].id)
        if (!postStore) {
          postsSync.push(postsDb[i])
        }
      }
    }

    return postsSync
  }
}

export default new PostService()
