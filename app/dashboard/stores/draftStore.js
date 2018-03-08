import { observable, computed, action } from 'mobx'

import agent from '../agent'


class DraftStore {
  @observable state = 'pending' // 'pending' / 'done' / 'error'
  @observable page = 0
  @observable cache = observable.map()

  clear() {
    this.cache.clear()
    this.page = 0
  }

  @computed get posts() {
    return this.cache.values()
  }

  @action setPage(page) {
    this.page = page
  }

  @action 
  fetch() {
    this.state = 'pending'

    agent.Posts.all(this.page, 10, true).then(
      action('success', res => {
        this.cache.clear()
        res.data.forEach(post => this.cache.set(post.id, post))
        this.state = 'done'
      }),

      action('error', error => {
        this.state = 'error'
      })
    )
  }

}

export default new DraftStore()
