import IImage from './IImage'

export default interface IAlbum {
  uri: string
  name: string
  images: IImage[]
}
