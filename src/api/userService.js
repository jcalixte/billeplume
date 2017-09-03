import api from './'

class UserService {
  async login (email, password) {
    try {
      let user = await api.auth.signInWithEmailAndPassword(email, password)
      console.log(user)
      return user.toJSON()
    } catch (e) {
      console.error(e)
    }
  }

  async register (email, password) {
    try {
      await api.auth.createUserWithEmailAndPassword(email, password)
    } catch (e) {
      console.error(e)
    }
  }

  async logout () {
    try {
      await api.auth.signOut()
    } catch (e) {
      console.error(e)
    }
  }
}

export default new UserService()
