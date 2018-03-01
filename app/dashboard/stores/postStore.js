import { observable, computed, action } from 'mobx'
import axios from 'axios'

import agent from '../agent'

const LIMIT = 10

class PostStore {
  @observable state = 'pending' // 'pending' / 'done' / 'error'
  @observable page = 0
  @observable cache = observable.map()

  clear() {
    this.cache.clear()
    this.page = 0
  }

  find(id) {
    return this.cache.get(id)
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

    agent.Posts.all(this.page, LIMIT).then(
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

  @action
  get(id, acceptCached=false) {
    if (acceptCached) {
      const post = this.find(id)
      if (post) return Promise.resolve(post)
    }
    return agent.Posts.get(id).then(
      action('get', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  create(data) {
    return agent.Posts.create(data).then(
      action('create', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  update(id, data) {
    return agent.Posts.update(id, data).then(
      action('update', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  destory(id) {
    this.cache.delete(id)
    return agent.Posts.destory(id)
  }

}

export default new PostStore()
