import { observable, action } from 'mobx'

class UiStore {
  @observable toolbox = {
    visible: false,
    show: undefined  // meta, help, photo
  }

  @observable aside = {
    visible: true,
    collapse: false
  }

  constructor() {
    this.updateAside()
  }

  @action.bound
  showToolbox(side) {
    this.toolbox = {
      visible: true,
      show: side
    }
  }

  @action.bound
  hideToolbox() {
    this.toolbox = {
      visible: false,
      show: undefined
    }
  }

  @action.bound
  toggleAside() {
    this.aside.collapse = !this.aside.collapse
  }

  @action.bound
  updateAside() {
    this.aside.collapse = window.innerWidth < 768 ? true : false
  }

  @action.bound
  showAside() {
    this.aside.visible = true
  }

  @action.bound
  hideAside() {
    this.aside.visible = false
  }

}

export default new UiStore()