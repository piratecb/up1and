import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer} from 'mobx-react'
import classNames from 'classnames'

import MetaEditor from './MetaEditor'
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


@inject('metaStore', 'metaEditor')
@observer
class Metas extends React.Component {

  constructor(props) {
    super(props)
    this.onNewMetaClicked = this.onNewMetaClicked.bind(this)
  }

  componentDidMount() {
    this.props.metaStore.fetch()
    this.props.metaEditor.hide()
    document.title = 'Metas'
  }

  onNewMetaClicked(e) {
    this.props.metaEditor.show()
    this.props.metaEditor.reset()
  }

  render() {
    const hasID = this.props.metaEditor.id
    const title = hasID ? 'Edit' : 'New'
    const formSection = (
      <Section title={title}>
        <div className="content">
          <MetaEditor />
        </div>
      </Section>
    )
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
        {this.props.metaEditor.visible ? formSection : null}
        </div>
      </div>
    )
  }

}

export default Metas