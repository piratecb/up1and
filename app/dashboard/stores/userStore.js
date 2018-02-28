import { observable, action } from 'mobx'

class userStore {
    @observable currentUser = 'upland'

    @action.bound
    load() {
        
    }
}

export default new userStore()