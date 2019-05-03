import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Aside from './Aside'
import Posts from './Posts'
import Pages from './Pages'
import Metas from './Metas'
import Home from './Home'
import Setting from './Setting'
import PostEditor from './PostEditor'
import PageEditor from './PageEditor'


class App extends React.Component {

  render() {
    return (
      <div className="layout">
        <Aside />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/pages" component={Pages} />
          <Route path="/metas" component={Metas} />
          <Route path="/post/:id?" component={PostEditor} />
          <Route path="/page/:id?" component={PageEditor} />
          <Route path="/settings" component={Setting} />
        </Switch>
      </div>
    )
  }
}

export default App
