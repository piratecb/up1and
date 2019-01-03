import { observable, computed, action } from 'mobx'

import agent from '../agent'


class PageStore {
  @observable state = 'pending' // 'pending' / 'done' / 'error'
  @observable cache = observable.map()

  clear() {
    this.cache.clear()
  }

  find(id) {
    return this.cache.get(id)
  }

  @computed get pages() {
    return Array.from(this.cache.values())
  }

  @action 
  fetch() {
    this.state = 'pending'

    agent.Pages.all().then(
      action('success', res => {
        this.cache.clear()
        res.data.items.forEach(page => this.cache.set(page.id, page))
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
      const page = this.find(id)
      if (page) return Promise.resolve(page)
    }
    return agent.Pages.get(id).then(
      action('get', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  create(data) {
    return agent.Pages.create(data).then(
      action('create', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  update(id, data) {
    return agent.Pages.update(id, data).then(
      action('update', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  destory(id) {
    this.cache.delete(id)
    return agent.Pages.destory(id)
  }

}

export default new PageStore()
