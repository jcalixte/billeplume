/* tslint:disable:no-console */
import bus, { NEW_SW, SKIP_WAITING } from '@/utils/bus-event'

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        `App is being served from cache by a service worker.
        For more details, visit https://goo.gl/AFskqB`
      )
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updated(reg: any) {
      bus.$emit(NEW_SW)
      bus.$on(SKIP_WAITING, () => {
        try {
          console.log('skip waiting', { reg })
          location.reload(true)
        } catch (error) {
          console.error(error)
        }
      })
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
