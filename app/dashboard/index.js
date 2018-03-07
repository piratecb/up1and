import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'

import App from './components/App'

import uiStore from './stores/uiStore'
import userStore from './stores/userStore'
import postStore from './stores/postStore'
import editorStore from './stores/editorStore'



const stores = {
  uiStore,
  userStore,
  postStore,
  editorStore,
}

window.stores = stores

useStrict(true)

render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>, document.getElementById('app'))
