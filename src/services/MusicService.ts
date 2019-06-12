import IState from '@/models/music/IState'
import '@/utils/spotify'
import bus, { MUSIC_UPDATE } from '@/utils/bus-event'

declare const Spotify: any

interface IResultListener {
  message: any
  device_id: string
}

class MusicService {
  public initPlayer(accessToken?: string): void {
    const w = window as any
    w.onSpotifyWebPlaybackSDKReady = () => {
      const token = accessToken
        ? accessToken
        : // tslint:disable-next-line:max-line-length
          'BQCj4TUxzT4FW-apSYJI-pU2AGI9QojrFJQGTxyX4zA8hNxGxnEHkqh8gUE-MpH78KoGM5sbDeYSyBrMWgdCLcFjhY8y7YVg8HZZmp9DL0t4WOAPpZBIya5n7OBAmO5FyrQdzCKA2cbnFKyrPMzJjjgQIBmXdCQAprCQHm4LGXGG8w'
      const player = new Spotify.Player({
        name: 'bille plume',
        getOAuthToken: (cb: any) => {
          cb(token)
        }
      })

      // Error handling
      player.addListener(
        'initialization_error',
        ({ message }: IResultListener) => {
          // tslint:disable-next-line:no-console
          console.error(message)
        }
      )
      player.addListener(
        'authentication_error',
        ({ message }: IResultListener) => {
          // tslint:disable-next-line:no-console
          console.error(message)
        }
      )
      player.addListener('account_error', ({ message }: IResultListener) => {
        // tslint:disable-next-line:no-console
        console.error(message)
      })
      player.addListener('playback_error', ({ message }: IResultListener) => {
        // tslint:disable-next-line:no-console
        console.error(message)
      })

      // Playback status updates
      player.addListener('player_state_changed', (state: IState) => {
        bus.$emit(MUSIC_UPDATE, state)
      })

      // Ready
      player.addListener('ready', ({ device_id }: IResultListener) => {
        // tslint:disable-next-line:no-console
        console.log('Ready with Device ID', device_id)
      })

      // Not Ready
      player.addListener('not_ready', ({ device_id }: IResultListener) => {
        // tslint:disable-next-line:no-console
        console.log('Device ID has gone offline', device_id)
      })

      // Connect to the player!
      player.connect()
    }
  }
}

export default new MusicService()
