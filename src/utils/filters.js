import format from 'date-fns/format'

export const date = date => {
  if (!date) {
    return ''
  }

  return format(date, 'DD/MM/YYYY')
}

export const time = date => {
  if (!date) {
    return ''
  }

  return format(date, 'HH:mm')
}
