import IModel from './IModel'
import ProgressType from '@/enums/ProgressType'

export default interface IArticle extends IModel {
  title: string
  slug: string
  date: Date
  content: string
  publish: boolean
  color: string
  chapter: number
  font: string
  progressType: ProgressType
  version: number
}
