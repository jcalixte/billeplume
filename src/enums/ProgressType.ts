enum ProgressType {
  none,
  all,
  year,
  month,
  day
}

export default ProgressType

export const progressTypeLabel: { [key: number]: string } = {
  [ProgressType.none]: 'aucune',
  [ProgressType.all]: 'toute',
  [ProgressType.year]: 'année',
  [ProgressType.month]: 'mois',
  [ProgressType.day]: 'jour'
}
