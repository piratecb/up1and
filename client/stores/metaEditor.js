import { observable, action } from 'mobx'
import metaStore from './metaStore'


class metaEditor {
  @observable inProgress = false
  @observable errors = undefined
  @observable visible = false
  @observable id = undefined

  @observable name = ''
  @observable slug = ''
  @observable description = ''

  @action
  setID(id) {
    if (this.id != undefined && this.id === id) {
      this.reset()
      this.visible = false
    } else {
      this.id = id
      this.visible = true
    }
  }

  @action
  show() {
    this.visible = true
  }

  @action
  hide() {
    this.visible = false
  }

  @action
  load() {
    if (!this.id) return Promise.resolve()
    this.inProgress = true
    return metaStore.get(this.id, true)
      .then(action(meta => {
        if (!meta) throw new Error('Can\'t load meta')
        this.name = meta.name
        this.slug = meta.slug
        this.description = meta.description || ''
      }))
      .finally(action(() => { this.inProgress = false }))
  }

  @action
  reset() {
    this.id = undefined
    this.name = ''
    this.slug = ''
    this.description = ''
  }

  @action
  setName(name) {
    this.name = name
  }

  @action
  setSlug(slug) {
    this.slug = slug
  }

  @action
  setDescription(description) {
    this.description = description
  }

  @action
  submit() {
    this.inProgress = true
    this.errors = undefined
    const meta = {
      name: this.name,
      slug: this.slug,
      description: this.description,
    }
    return (this.id ? metaStore.update(this.id, meta) : metaStore.create(meta))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors; throw err
      }))
      .finally(action(() => { this.inProgress = false }))
  }
}

export default new metaEditor()
