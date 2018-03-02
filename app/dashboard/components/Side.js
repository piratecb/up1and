import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'


function MarkdownHelpView(props) {
  return (
    <nav className="markdown-help">
      {props.items.map((item) => 
        <NavLink exact to={item.url} activeClassName="active" key={item.url}>
          <i className={'icon fa ' + item.icon} aria-hidden="true"></i>
          <span>{item.name}</span>
        </NavLink>
      )}
    </nav>
  )
}


@inject('asideStore', 'userStore')
@observer
class Side extends React.Component {
  render() {
    if (!this.props.asideStore.visible) {
      return null
    }
    return (
      <aside className="side-overlay">

      </aside>
    )
  }

}

export default Side