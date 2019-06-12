export default interface IModel {
  _id?: string
  _rev?: string
  _deleted?: boolean
  _conflicts?: string[]
  doctype?: string
}
