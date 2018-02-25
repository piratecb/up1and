import { observable, action } from 'mobx'
import axios from 'axios'

import req from '../utils'

class PostStore {
    @observable posts = []
    @observable drafts = []
    @observable state = 'pending' // 'pending' / 'done' / 'error'

    @action 
    fetch() {
        this.posts = []
        this.state = 'pending'

        // posts?draft=true

        req.get('posts').then(
            action('success', posts => {
                this.posts = posts.data
                this.state = 'done'
            }),

            action('error', error => {
                this.state = 'error'
            })
        )
    }
}

const post = new PostStore()
export default post
