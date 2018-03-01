import { observable, action } from 'mobx'

class AsideStore {
  @observable collapse
  @observable visible = true

  constructor() {
    this.update()
  }

  @action.bound
  toggle() {
    this.collapse = !this.collapse
  }

  @action.bound
  update() {
    this.collapse = window.innerWidth < 768 ? true : false
  }

  @action.bound
  show() {
    this.visible = true
  }

  @action.bound
  hide() {
    this.visible = false
  }

}

export default new AsideStore()