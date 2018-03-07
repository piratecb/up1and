import { observable, computed, action } from 'mobx'

import agent from '../agent'


class MetaStore {
  @observable state = 'pending' // 'pending' / 'done' / 'error'
  @observable cache = observable.map()

  clear() {
    this.cache.clear()
  }

  find(id) {
    return this.cache.get(id)
  }

  @computed get metas() {
    return this.cache.values()
  }

  @action 
  fetch() {
    this.state = 'pending'

    agent.Metas.all().then(
      action('success', res => {
        this.cache.clear()
        res.data.forEach(meta => this.cache.set(meta.id, meta))
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
      const meta = this.find(id)
      if (meta) return Promise.resolve(meta)
    }
    return agent.Metas.get(id).then(
      action('get', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  create(data) {
    return agent.Metas.create(data).then(
      action('create', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  update(id, data) {
    return agent.Metas.update(id, data).then(
      action('update', res => {
        this.cache.set(res.data.id, res.data)
        return res.data
      })
    )
  }

  @action
  destory(id) {
    this.cache.delete(id)
    return agent.Metas.destory(id)
  }

}

export default new MetaStore()
