import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Posts from './pages/Posts'
import AddPost from './pages/AddPost'

render((
  <Router>
    <div className="layout">
      <Sidebar />
      <Route exact path="/" component={Home}/>
      <Route path="/posts" component={Posts}/>
      <Route path="/post-draft" component={AddPost}/>
    </div>
  </Router>
), document.getElementById('app'))
