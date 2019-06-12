import { debounce } from 'lodash-es'
import notif from '@/utils/notif'

export const confirmation = debounce(
  (message: string) => {
    notif.confirm(message)
  },
  3000,
  {
    leading: true
  }
)

export const alertMessage = debounce(
  (message: string) => {
    notif.alert(message)
  },
  3000,
  {
    leading: true
  }
)

export const primary: string = '#3f4fa6'
export const main: string = '#2c3e50'

export const slug = (text: string): string => {
  if (!text) {
    return ''
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
