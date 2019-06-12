import ITrack from './ITrack'

export default interface IState {
  context: {
    uri: string
    metadata: {
      context_description?: string
    }
  }
  bitrate: number
  position: number
  duration: number
  paused: boolean
  shuffle: boolean
  repeat_mode: number
  track_window: {
    current_track: ITrack
    next_tracks: ITrack[]
  }
  timestamp: number
  restrictions: {
    disallow_resuming_reasons: string[]
  }
  disallows: {
    resuming: boolean
  }
}
