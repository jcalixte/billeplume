import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Api {
  firebaseApp

  constructor () {
    this.firebaseInit()
  }

  firebaseInit () {
    // Initialisation de Firebase
    const config = {
      apiKey: 'AIzaSyAPo7Tp4MNAOOzU0XzFHC7l6KWDyRFIwvo',
      authDomain: 'billet-inspiration.firebaseapp.com',
      databaseURL: 'https://billet-inspiration.firebaseio.com',
      projectId: 'billet-inspiration',
      storageBucket: 'billet-inspiration.appspot.com',
      messagingSenderId: '608468754356'
    }
    this.firebaseApp = firebase.initializeApp(config)
  }

  /**
   * @returns {firebase.auth.Auth}
   */
  get auth () {
    return this.firebaseApp.auth()
  }

  /**
   * @returns {firebase.database.Database}
   */
  get database () {
    return this.firebaseApp.database()
  }
}

export default new Api()
