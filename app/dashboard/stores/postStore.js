import { observable, action } from 'mobx'
import axios from 'axios'

import agent from '../agent'

class PostStore {
    @observable posts = []
    @observable drafts = []
    @observable state = 'pending' // 'pending' / 'done' / 'error'

    @action 
    fetch() {
        this.posts = []
        this.state = 'pending'

        // posts?draft=true

        agent.get('posts').then(
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

export default new PostStore()
