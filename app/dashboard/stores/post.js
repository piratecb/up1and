import { observable, action } from 'mobx'
import axios from 'axios'

class PostStore {
    @observable posts = {}

    @action all() {
        var response = axios.get(`/api/posts`)

        this.posts = response.data
    }
}

const post = new PostStore()
export default post
