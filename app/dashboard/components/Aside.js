import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'


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


@inject('uiStore', 'userStore')
@observer
class Aside extends React.Component {

  constructor(props) {
    super(props)
    this.aside = this.props.uiStore.aside
    this.aside.toggle = this.props.uiStore.toggleAside
    this.primaryMenus = [
        {icon: 'ion-ios-home-outline', url: '/', name: 'Home'},
        {icon: 'ion-ios-list-outline', url: '/posts', name: 'Posts'},
        {icon: 'ion-ios-pricetag-outline', url: '/metas', name: 'Metas'},
        {icon: 'ion-ios-paper-outline', url: '/pages', name: 'Pages'}
      ]
    this.settingMenus = [
        {icon: 'ion-ios-settings', url: '/settings', name: 'Settings'},
        {icon: 'ion-log-out', url: '/logout', name: 'Logout'}
      ]
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.uiStore.updateAside)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.uiStore.updateAside)
  }

  render() {
    if (!this.aside.visible) {
      return null
    }
    const asideClass = classNames('side', { 'collapse': this.aside.collapse })
    return (
      <aside className={asideClass}>
        <Logo currentUser={this.props.userStore.currentUser}/>
        <div className="navgation">
          <Menu items={this.primaryMenus} />
          <Menu items={this.settingMenus} />
        </div>
        <Bottom aside={this.aside} />
      </aside>
    )
  }

}

export default Aside