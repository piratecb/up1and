import { observable, action } from 'mobx'
import postStore from './postStore'


class PostEditor {
  @observable inProgress = false
  @observable errors = undefined
  @observable id = undefined

  @observable title = ''
  @observable slug = ''
  @observable headline = ''
  @observable content = ''
  @observable metas = []
  // status type

  @action
  setID(id) {
    if (this.id !== id) {
      this.reset()
      this.id = id
    }
  }

  @action
  load() {
    if (!this.id) return Promise.resolve()
    this.inProgress = true
    return postStore.get(this.id, true)
      .then(action(post => {
        if (!post) throw new Error('Can\'t load post')
        this.title = post.title
        this.slug = post.slug
        this.headline = post.headline || ''
        this.content = post.content || ''
        this.metas = post.metas
      }))
      .finally(action(() => { this.inProgress = false }))
  }

  @action
  reset() {
    this.title = ''
    this.slug = ''
    this.headline = ''
    this.content = ''
    this.metas = []
  }

  @action
  setTitle(title) {
    this.title = title
  }

  @action
  setSlug(slug) {
    this.slug = slug
  }

  @action
  setHeadline(headline) {
    this.headline = headline
  }

  @action
  setContent(content) {
    this.content = content
  }

  @action
  addMeta(meta) {
    if (this.metas.includes(meta)) return
    this.metas.push(meta);
  }

  @action
  removeMeta(meta) {
    this.metas = this.metas.filter(m => m !== meta)
  }

  @action
  submit() {
    this.inProgress = true
    this.errors = undefined
    const post = {
      title: this.title,
      slug: this.slug,
      headline: this.headline,
      content: this.content,
      // metas: this.metas
    }
    return (this.id ? postStore.update(this.id, post) : postStore.create(post))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors; throw err
      }))
      .finally(action(() => { this.inProgress = false }))
  }
}

export default new PostEditor()
