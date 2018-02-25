import { observable, action } from 'mobx'

class Menu {
    @observable collapse

    constructor() {
    	this.updateCollapse()
    }

    @action.bound
    toggle() {
        this.collapse = !this.collapse
    }

    @action.bound
    updateCollapse() {
    	this.collapse = window.innerWidth < 768 ? true : false
    }
}

const menu = new Menu()
export default menu