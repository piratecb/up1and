import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'


const PRIMARY_MENUS = [
      {icon: 'ion-ios-home-outline', url: '/', name: 'Home'},
      {icon: 'ion-ios-list-outline', url: '/posts', name: 'Posts'},
      {icon: 'ion-ios-pricetag-outline', url: '/metas', name: 'Metas'},
      {icon: 'ion-ios-paper-outline', url: '/pages', name: 'Pages'}
    ]
const SETTING_MENUS = [
      {icon: 'ion-ios-settings', url: '/settings', name: 'Settings'},
      {icon: 'ion-log-out', url: '/logout', name: 'Logout'}
    ]


function Menu(props) {
  return (
    <nav className="menu">
      {props.items.map((item) => 
        <NavLink exact to={item.url} activeClassName="active" key={item.url}>
          <i className={'icon fa ' + item.icon} aria-hidden="true"></i>
          <span>{item.name}</span>
        </NavLink>
      )}
    </nav>
  )
}


function Logo(props) {
  let currentUser = props.currentUser
  return (
    <div className="userinfo">
      <div className="logo">
        <span className="avatar avatar-circle">
          <span className="prefix">{currentUser.charAt(0).toUpperCase()}</span></span>
      </div>
      <div className="name">
        <span>{currentUser.toUpperCase()}</span>
      </div>
    </div>
  )
}


function Bottom(props) {
  let iconClass = classNames('icon', {'ion-chevron-right': props.aside.collapse, 'ion-chevron-left': !props.aside.collapse})
  return (
    <div className="bottom" onClick={props.aside.toggle}>
      <i className={iconClass}></i>
    </div>
  )
}


@inject('asideStore', 'userStore')
@observer
class Aside extends React.Component {
  render() {
    const asideClass = classNames('side', { 'collapse': this.props.asideStore.collapse })
    return (
      <aside className={asideClass}>
        <Logo currentUser={this.props.userStore.currentUser}/>
        <div className="navgation">
          <Menu items={PRIMARY_MENUS} />
          <Menu items={SETTING_MENUS} />
        </div>
        <Bottom aside={this.props.asideStore} />
      </aside>
    )
  }

}

export default Aside