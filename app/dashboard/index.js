import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Posts from './pages/Posts'

render((
  <Router>
    <div className="layout">
      <Sidebar />
      <Route exact path="/dashboard" component={Home}/>
      <Route path="/dashboard/posts" component={Posts}/>
    </div>
  </Router>
), document.getElementById('app'))
