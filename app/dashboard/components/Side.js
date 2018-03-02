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
        <div className="side-overlay-content">
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


function PhotoChooserView(props) {
  return (
      <Tabs className="side-overlay-main">
        <TabList className="side-overlay-head">
          <Tab>Images</Tab>
        </TabList>
        <div className="side-overlay-content">
          <TabPanel>
            Empty
          </TabPanel>
        </div>
      </Tabs>
  )
}


function PostMetaView(props) {
  return (
      <Tabs className="side-overlay-main">
        <TabList className="side-overlay-head">
          <Tab>General</Tab>
          <Tab>Metas</Tab>
          <Tab>Status</Tab>
        </TabList>
        <div className="side-overlay-content">
          <TabPanel>
            General
          </TabPanel>
          <TabPanel>
            Metas
          </TabPanel>
          <TabPanel>
            Status
          </TabPanel>
        </div>
      </Tabs>
  )
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
        component = <PostMetaView />
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