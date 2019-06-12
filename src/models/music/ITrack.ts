import IArtist from './IArtist'
import IAlbum from './IAlbum'

export default interface ITrack {
  id: string
  uri: string
  type: string
  linked_from_uri: boolean | null
  linked_from: {
    uri: string | null
    id: string | null
  }
  media_type: string
  name: string
  duration_ms: number
  artists: IArtist[]
  album: IAlbum
  is_playable: boolean
}
