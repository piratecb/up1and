import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'


function MarkdownHelpView(props) {
  return (
      <Tabs className="side-overlay-main">
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
        <Tabs className="side-overlay-main">
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


class PostMetaView extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Tabs className="side-overlay-main">
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
                  <button type="button" className="btn btn-primary"><span>Save</span></button>
                </div>
              </div>
              <div className="side-overlay-view">
                <div className="form-field small">
                  <span><label>Slug</label></span>
                  <input className="form-field-input" type="text" placeholder="" />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                  <button type="button" className="btn"><span>New Meta</span></button>
                </div> 
                <div className="two-column-action">
                  <button type="button" className="btn btn-primary"><span>Save</span></button>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="two-column side-overlay-action">
                <div className="two-column-main">
                  <button type="button" className="btn"><span>Mark as draft</span></button>
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


@inject('sideStore')
@observer
class Side extends React.Component {

  constructor(props) {
    super(props)
    this.onMaskClicked = this.onMaskClicked.bind(this)
  }

  onMaskClicked(e) {
    this.props.sideStore.hide()
  }

  render() {
    if (!this.props.sideStore.visible) {
      return null
    }

    let component = null
    switch (this.props.sideStore.side) {
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
        <div className="side-overlay-mask" onClick={this.onMaskClicked}></div>
        {component}
      </aside>
    )
  }

}

export default Side