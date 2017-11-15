import React from 'react'
import {render} from 'react-dom'

import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Posts from './pages/Posts.jsx'

class App extends React.Component {
  render () {
    return (
      <div className="layout">
        <Sidebar />
        <Posts />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'))