export default interface IImportMusic {
  [k: string]: {
    color: string
    media: () => Promise<string>
  }
}
