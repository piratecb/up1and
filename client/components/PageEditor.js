import React from 'react'
import { observable, action } from 'mobx'
import { observer, inject} from 'mobx-react'
import { withRouter } from 'react-router-dom'

import { Section } from './Layout'


@inject('pageStore')
@withRouter
@observer
class PageEditor extends React.Component {
  @observable title = ''
  @observable slug = ''
  @observable content = ''

  constructor(props) {
    super(props)
    this.id = undefined
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    document.title = this.id ? 'Edit Page' : 'New Page'
    if (this.id) this.load()
  }

  @action
  onChange = e => {
    const { name, value } = e.target
    this[name] = value
  }

  load = () => {
    this.props.pageStore.get(this.id, true)
      .then(
        action(page => {
          if (!page) throw new Error('Can\'t load page')
          this.title = page.title
          this.slug = page.slug
          this.content = page.content || ''
        })
      )
  }

  onSubmit(e) {
    e.preventDefault()
    if (!this.title || !this.slug) return
    const pageStore = this.props.pageStore
    const page = {
      title: this.title,
      slug: this.slug,
      content: this.content,
    }
    const response = this.id ? pageStore.update(this.id, page) : pageStore.create(page)
    response
      .then(() => {
        this.props.history.replace(`/pages/`)
      })
  }

  onDelete(e) {
    if (this.id) {
      this.props.pageStore.destory(this.id)
        .then(() => {
          this.props.history.replace(`/pages/`)
      })
    }
  }

  form() {
    const { title, slug, content } = this
    const saveButton = (
      <button type="button" className="btn btn-primary" onClick={this.onSubmit}>
        Save
      </button>
    )
    const deleteButton = (
      <button type="button" className="btn btn-error" onClick={this.onDelete}>
        Delete
      </button>
    )
    const inputStyle = { maxWidth: '700px' }
    return (
      <form className="page-form">
        <div className="form-field">
          <span><label>Title</label></span>
          <input 
            className="form-field-input"
            name="title" 
            onChange={this.onChange} 
            value={title}
            style={inputStyle}
          />
        </div>

        <div className="form-field">
          <span><label>Slug</label></span>
          <input 
            className="form-field-input"
            name="slug" 
            onChange={this.onChange} 
            value={slug}
            style={inputStyle}
          />
        </div>

        <div className="form-field">
          <span><label>Content</label></span>
          <textarea 
            className="form-field-input"
            name="content" 
            onChange={this.onChange} 
            value={content}
          />
        </div>

        <div className="form-field">
          {saveButton}
          {this.id ? deleteButton : null}
        </div>
      </form>
    )
  }

  render() {
    const title = this.id ? 'Edit Page' : 'New Page'
    return (
      <div className="main">
        <div className="container">
          <Section title={title}>
            <div className="content">
              {this.form()}
            </div>
          </Section>
        </div>
      </div>
      )
  }

}

export default PageEditor
