import React from 'react'
import { inject, observer} from 'mobx-react'

import { Section } from './Layout'


@inject('metaEditor', 'metaStore')
@observer
class MetaEditor extends React.Component {

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  changeName = e => this.props.metaEditor.setName(e.target.value)
  changeSlug = e => this.props.metaEditor.setSlug(e.target.value)
  changeDescription = e => this.props.metaEditor.setDescription(e.target.value)

  onSubmit(e) {
    e.preventDefault()
    const { metaEditor } = this.props
    metaEditor.submit()
    if (this.props.autoClose) this.props.metaEditor.hide()
  }

  onDelete(e) {
    const id = this.props.metaEditor.id
    if (id) {
      this.props.metaStore.destory(id)
        .then(() => {
          this.props.metaEditor.reset()
          this.props.metaEditor.hide()
      })
    }
  }

  render() {
    const { inProgress, errors, name, slug, description } = this.props.metaEditor
    const createButton = (
      <button type="button" className="btn btn-primary" onClick={this.onSubmit}>
        {this.props.metaEditor.id ? 'Save' : 'Create'}
      </button>
    )
    const deleteButton = (
      <button type="button" className="btn btn-error" onClick={this.onDelete}>
        Delete
      </button>
    )
    return (
      <form className="meta-form">
        <div className="form-field">
          <span><label>Name</label></span>
          <input 
            className="form-field-input"
            type="text"
            value={name}
            onChange={this.changeName}
          />
        </div>

        <div className="form-field">
          <span><label>Slug</label></span>
          <input 
            className="form-field-input"
            type="text"
            value={slug}
            onChange={this.changeSlug}
          />
        </div>

        <div className="form-field">
          <span><label>Description</label></span>
          <textarea 
            className="form-field-input"
            type="text"
            value={description}
            onChange={this.changeDescription}
          />
        </div>

        <div className="form-field">
          {createButton}
          {this.props.metaEditor.id ? deleteButton : null}
        </div>
      </form>
    )
  }

}

export default MetaEditor
