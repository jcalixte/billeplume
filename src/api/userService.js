import api from './'
import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

class UserService {
  async login (email, password) {
    try {
      bus.$emit(LOADING, 'login')
      let user = await api.auth.signInWithEmailAndPassword(email, password)
      console.log(user)
      bus.$emit(FINISHED, 'login')
      return user.toJSON()
    } catch (e) {
      console.error(e)
    }
  }

  async register (email, password) {
    try {
      bus.$emit(LOADING, 'register')
      await api.auth.createUserWithEmailAndPassword(email, password)
      bus.$emit(FINISHED, 'register')
    } catch (e) {
      console.error(e)
    }
  }

  async logout () {
    try {
      bus.$emit(LOADING, 'logout')
      await api.auth.signOut()
      bus.$emit(FINISHED, 'logout')
    } catch (e) {
      console.error(e)
    }
  }
}

export default new UserService()
