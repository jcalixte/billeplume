export const fulldate = (value: string, country: string = 'fr-FR') => {
  return new Intl.DateTimeFormat(country, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(value))
}

export default {
  date: (value: string, country: string = 'fr-FR') => {
    return new Intl.DateTimeFormat(country).format(new Date(value))
  },
  fulldate
} as { [key: string]: (...args: any[]) => any }
