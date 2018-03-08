import { observable, action } from 'mobx'

class ToolboxStore {
  @observable visible = false
  @observable side = undefined  // meta, help, photo

  @action.bound
  show(side) {
    this.visible = true
    this.side = side
  }

  @action.bound
  hide() {
    this.visible = false
    this.side = undefined
  }

}

export default new ToolboxStore()