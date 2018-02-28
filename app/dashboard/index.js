import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'

import App from './components/App'

import asideStore from './stores/asideStore'
import userStore from './stores/userStore'
import postStore from './stores/postStore'

const stores = {
  asideStore,
  userStore,
  postStore
}

window.stores = stores

useStrict(true)

render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>, document.getElementById('app'))
