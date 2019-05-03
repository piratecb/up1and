import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'

import App from './components/App'

import userStore from './stores/userStore'
import postStore from './stores/postStore'
import draftStore from './stores/draftStore'
import pageStore from './stores/pageStore'
import metaStore from './stores/metaStore'
import asideStore from './stores/asideStore'
import toolboxStore from './stores/toolboxStore'

import postEditor from './stores/postEditor'
import metaEditor from './stores/metaEditor'

import './assets/css/dashboard.css'

const stores = {
  userStore,
  postStore,
  draftStore,
  pageStore,
  metaStore,
  postEditor,
  metaEditor,
  asideStore,
  toolboxStore,
}

window.stores = stores

configure({
  enforceActions: 'observed'
})

render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>, document.getElementById('app'))
