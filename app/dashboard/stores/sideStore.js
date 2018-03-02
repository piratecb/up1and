import { observable, action } from 'mobx'

class SideStore {
  @observable visible = false
  @observable side = undefined  // meta, help, photo

  @action.bound
  show(side) {
    this.side = side
    this.visible = true
  }

  @action.bound
  hide() {
    this.visible = false
    this.side = undefined
  }

}

export default new SideStore()