import { observable, action } from 'mobx'

class AsideStore {
    @observable collapse

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
}

export default new AsideStore()