import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'

import App from './components/App'

import uiStore from './stores/uiStore'
import userStore from './stores/userStore'
import postStore from './stores/postStore'
import metaStore from './stores/metaStore'
import postEditor from './stores/postEditor'
import metaEditor from './stores/metaEditor'


const stores = {
  uiStore,
  userStore,
  postStore,
  metaStore,
  postEditor,
  metaEditor,
}

window.stores = stores

useStrict(true)

render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>, document.getElementById('app'))
