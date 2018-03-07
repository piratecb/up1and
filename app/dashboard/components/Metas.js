import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer} from 'mobx-react'
import classNames from 'classnames'

import { Section } from './Layout'


@inject('metaEditor')
@observer
class Tag extends React.Component {

  constructor(props) {
    super(props)
    this.onTagClicked = this.onTagClicked.bind(this)
  }

  onTagClicked() {
    this.props.metaEditor.setID(this.props.meta.id)
    this.props.metaEditor.load()
  }

  render() {
    const checked = this.props.meta.id == this.props.metaEditor.id
    const tagClass = classNames('tag', {'tag-checked': checked})
    return (
      <div className={tagClass} onClick={this.onTagClicked}>{this.props.meta.name}</div>
    )
  }

}


@inject('metaEditor', 'metaStore')
@observer
class MetaForm extends React.Component {

  constructor(props) {
    super(props)
    this.onCreateClicked = this.onCreateClicked.bind(this)
    this.onDeleteClicked = this.onDeleteClicked.bind(this)
  }

  changeName = e => this.props.metaEditor.setName(e.target.value)
  changeSlug = e => this.props.metaEditor.setSlug(e.target.value)
  changeDescription = e => this.props.metaEditor.setDescription(e.target.value)

  onCreateClicked(e) {
    e.preventDefault()
    const { metaEditor } = this.props
    metaEditor.submit()
  }

  onDeleteClicked(e) {
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
    const hasID = this.props.metaEditor.id
    const title = hasID ? 'Edit' : 'New'
    if (!this.props.metaEditor.visible) {
      return null
    }
    const createButton = (
      <button type="button" className="btn btn-primary" onClick={this.onCreateClicked}>
        {this.props.metaEditor.id ? 'Save' : 'Create'}
      </button>
    )
    const deleteButton = (
      <button type="button" className="btn btn-error" onClick={this.onDeleteClicked}>
        Delete
      </button>
    )
    return (
      <Section title={title}>
        <div className="content">
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
        </div>
      </Section>
    )
  }

}


@inject('metaStore', 'metaEditor')
@observer
class Metas extends React.Component {

  constructor(props) {
    super(props)
    this.onNewMetaClicked = this.onNewMetaClicked.bind(this)
  }

  componentDidMount() {
    this.props.metaStore.fetch()
    document.title = 'Metas'
  }

  onNewMetaClicked(e) {
    this.props.metaEditor.show()
    this.props.metaEditor.reset()
  }

  render() {
    const button = (
      <button type="button" className="btn btn-primary" onClick={this.onNewMetaClicked}>
        <span>New Meta</span>
      </button>
    )
    const metas = this.props.metaStore.metas
    return (
      <div className="main">
        <div className="container">
        <Section title="Metas" action={button}>
          <div className="content">
            {metas.map((meta) =>
              <Tag key={meta.id} meta={meta} />
            )}
          </div>
        </Section>
        <MetaForm />
        </div>
      </div>
    )
  }

}

export default Metas