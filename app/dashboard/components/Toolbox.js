import React from 'react'
import { inject, observer } from 'mobx-react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import classNames from 'classnames'

import MetaEditor from './MetaEditor'


function MarkdownHelpView(props) {
  return (
      <Tabs className="side-overlay-main markdown-help">
        <TabList className="side-overlay-head">
          <Tab>Basic</Tab>
          <Tab>Image</Tab>
          <Tab>Extra</Tab>
        </TabList>
        <div className="side-overlay-view">
          <TabPanel>
            <h3>Strong</h3>
            <pre><code>**strong**</code></pre>
          </TabPanel>
          <TabPanel>
            <h3>Figcaption</h3>
            <pre><code>![alt text](https://path/to/img.jpg "title")</code></pre>
          </TabPanel>
          <TabPanel>
            <h3>Fenced Code</h3>
            <div>
              <pre>
              <code>
              ```python
              def hello():
                  print('hello')
              ```
              </code>
            </pre>
          </div>
          </TabPanel>
        </div>
      </Tabs>
  )
}


class PhotoChooserView extends React.Component {

  constructor(props) {
    super(props)
    this.onUploadImageClicked = this.onUploadImageClicked.bind(this)
  }

  onUploadImageClicked() {
    this.refs.uploadImage.click()
  }

  render() {
    return (
        <Tabs className="side-overlay-main photo-chooser">
          <TabList className="side-overlay-head">
            <Tab>Images</Tab>
          </TabList>
          <div className="side-overlay-content">
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                  <button type="button" className="btn" onClick={this.onUploadImageClicked} ><i className="icon ion-image"></i> <span>Upload</span></button>
                </div>
                <div className="two-column-action">
                  <button type="button" className="btn btn-primary"><span>Insert</span></button>
                </div>
              </div>
              <div className="side-overlay-view">
                <ul className="photo-chooser-grid">
                  <li><span><img src="https://c1.staticflickr.com/5/4622/25783645797_59c924acf3_h.jpg" /></span></li>
                  <li className="active"><span><img src="https://c1.staticflickr.com/5/4622/25783645797_59c924acf3_h.jpg" /></span></li>
                </ul>
                <input ref="uploadImage" type="file" accept="image/*" multiple="multiple" className="hidden"/>
              </div>
            </TabPanel>
          </div>
        </Tabs>
    )
  }

}


@inject('postEditor')
@observer
class Tag extends React.Component {

  constructor(props) {
    super(props)
    this.onTagClicked = this.onTagClicked.bind(this)
  }

  onTagClicked() {
    if (this.props.postEditor.metas.includes(this.props.meta.id)) {
      this.props.postEditor.removeMeta(this.props.meta.id)
    } else {
      this.props.postEditor.addMeta(this.props.meta.id)
    }
  }

  render() {
    const checked = this.props.postEditor.metas.includes(this.props.meta.id)
    const tagClass = classNames('tag', {'tag-checked': checked})
    return (
      <div className={tagClass} onClick={this.onTagClicked}>{this.props.meta.name}</div>
    )
  }

}


@inject('postEditor', 'metaEditor', 'metaStore', 'toolboxStore')
@observer
class PostMetaView extends React.Component {

  constructor(props) {
    super(props)
    this.changeSlug = this.changeSlug.bind(this)
    this.onNewMetaClicked = this.onNewMetaClicked.bind(this)
    this.onBackClicked = this.onBackClicked.bind(this)
    this.onMarkDraftClicked = this.onMarkDraftClicked.bind(this)
    this.onSaveClicked = this.onSaveClicked.bind(this)
  }

  componentDidMount() {
    this.props.metaStore.fetch()
  }

  changeSlug(e) {
    this.props.postEditor.setSlug(e.target.value)
  }

  onNewMetaClicked(e) {
    this.props.metaEditor.show()
    this.props.metaEditor.reset()
  }

  onBackClicked(e) {
    this.props.metaEditor.hide()
  }

  onMarkDraftClicked(e) {
    this.props.postEditor.submit().then(post => {
        this.props.toolboxStore.hide()
      }
    )
  }

  onSaveClicked(e) {
    this.props.postEditor.submit().then(post => {
        this.props.toolboxStore.hide()
      }
    )
  }

  render() {
    const slug = this.props.postEditor.slug
    const metas = this.props.metaStore.metas
    const metaItemView = metas.map((meta) =>
                  <Tag key={meta.id} meta={meta} />
                )
    const metaEditorView = <MetaEditor autoClose={true} /> 
    const newMetaButton = <button type="button" className="btn" onClick={this.onNewMetaClicked}><span>New Meta</span></button>
    const backButton = <button type="button" className="btn" onClick={this.onBackClicked}><span>Back</span></button>
    const markDraftButton = <button type="button" className="btn" onClick={this.onMarkDraftClicked}><span>Mark as draft</span></button>
    const saveButton = <button type="button" className="btn btn-primary" onClick={this.onSaveClicked}><span>Save</span></button>
    return (
        <Tabs className="side-overlay-main post-meta">
          <TabList className="side-overlay-head">
            <Tab>Basic</Tab>
            <Tab>Metas</Tab>
            <Tab>Status</Tab>
          </TabList>
          <div className="side-overlay-content">
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                </div> 
                <div className="two-column-action">
                  {saveButton}
                </div>
              </div>
              <div className="side-overlay-view">
                <div className="form-field">
                  <span><label>Slug</label></span>
                  <input className="form-field-input" type="text" value={slug} onChange={this.changeSlug} />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                  {this.props.metaEditor.visible ? backButton : newMetaButton}
                </div> 
                <div className="two-column-action">
                  {saveButton}
                </div>
              </div>
              <div className="side-overlay-view">
                {this.props.metaEditor.visible ? metaEditorView : metaItemView}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                  {this.props.postEditor.status ? markDraftButton : null}
                </div> 
                <div className="two-column-action">
                  <button type="button" className="btn btn-error" onClick={this.props.onDeleteClicked}><span>Delete</span></button>
                </div>
              </div>
            </TabPanel>
          </div>
        </Tabs>
    )
  }

}


@inject('toolboxStore')
@observer
class Toolbox extends React.Component {

  render() {
    if (!this.props.toolboxStore.visible) {
      return null
    }

    let component = null
    switch (this.props.toolboxStore.side) {
      case 'help':
        component = <MarkdownHelpView />
        break
      case 'photo':
        component = <PhotoChooserView />
        break
      case 'meta':
        component = <PostMetaView onDeleteClicked={this.props.onDeleteClicked}/>
        break
    }

    return (
      <aside className="side-overlay">
        <div className="side-overlay-mask" onClick={this.props.onMaskClicked}></div>
        {component}
      </aside>
    )
  }

}

export default Toolbox