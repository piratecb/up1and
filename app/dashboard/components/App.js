import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Aside from './Aside'
import Post from './Post'
import Editor from './Editor'
import Home from './Home'


@inject('asideStore')
@withRouter
@observer
class App extends React.Component {
  componentDidMount() {
      window.addEventListener('resize', this.props.asideStore.update)
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.props.asideStore.update)
  }

  render() {
    return (
      <div className="layout">
        <Aside />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/posts" component={Post} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </div>
    )
  }
}

export default App
