import IImportMusic from '@/models/IImportMusic'
import colors from '@/data/colors'

export const mediaList: IImportMusic = {
  heaven: {
    color: '',
    media: async () => (await import('@/assets/musics/heaven.mp3')).default
  },
  morning: {
    color: '',
    media: async () => (await import('@/assets/musics/morning.mp3')).default
  },
  easy: {
    color: '',
    media: async () => (await import('@/assets/musics/easy.mp3')).default
  },
  rain: {
    color: '',
    media: async () => (await import('@/assets/musics/rain.mp3')).default
  },
  dillistone: {
    color: '',
    media: async () => (await import('@/assets/musics/dillistone.wav')).default
  },
  nctrnm: {
    color: '',
    media: async () => (await import('@/assets/musics/nctrnm.mp3')).default
  },
  soularflair: {
    color: '',
    media: async () => (await import('@/assets/musics/soularflair.mp3')).default
  },
  alone: {
    color: '',
    media: async () => (await import('@/assets/musics/alone.mp3')).default
  },
  crown: {
    color: '',
    media: async () => (await import('@/assets/musics/crown.wav')).default
  }
} as IImportMusic

export const media: string[] = Object.keys(mediaList)

for (let i = 0; i < media.length; i++) {
  mediaList[media[i]].color = colors[i].value
}
