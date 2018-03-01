import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'


@inject('postStore')
@withRouter
@observer
class Editor extends React.Component {

  componentDidMount() {
    let data = {
      title: 'abc',
      headline: 'headline',
      content: 'text'
    }
    this.props.postStore.create(data)
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <section className="section">
            <h2>Editor</h2>
          </section>
        </div>
      </div>
    )
  }

}

export default Editor