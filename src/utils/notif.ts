class Notif {
  public confirm(message: string) {
    // tslint:disable-next-line:no-console
    console.log({ message })
  }
  public alert(message: string) {
    // tslint:disable-next-line:no-console
    console.log({ message })
  }
}

export default new Notif()
