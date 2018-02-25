import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import { Provider } from 'mobx-react'

import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Posts from './pages/Posts'
import AddPost from './pages/AddPost'

import stores from './stores'


class App extends React.Component {
  componentDidMount() {
      window.addEventListener('resize', stores.menu.update)
  }

  componentWillUnmount() {
      window.removeEventListener('resize', stores.menu.update)
  }

  render() {
    return (
      <Provider {...stores}>
        <Router>
          <div className="layout">
            <Sidebar />
            <Route exact path="/" component={Home}/>
            <Route path="/posts" component={Posts}/>
            <Route path="/post-draft" component={AddPost}/>
          </div>
        </Router>
      </Provider>
    );
  }
}

render(<App />, document.getElementById('app'))

window.stores = stores
