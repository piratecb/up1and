import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'


function MenuItem(props) {
  return (
    <NavLink exact to={props.value.url} activeClassName="active">
      <i className={'icon fa ' + props.value.icon} aria-hidden="true"></i>
      <span>{props.value.name}</span>
    </NavLink>
  )
}

function Menu(props) {
  const items = props.items;
  return (
    <nav className="menu">
      {items.map((item) =>
        <MenuItem key={item.name}
                  value={item} />
      )}
    </nav>
  )
}

function Logo(props) {
  const user = props.user;
  return (
    <div className="userinfo">
      <div className="logo">
        <span className="avatar avatar-circle">
          <span className="prefix">U</span></span>
      </div>
      <div className="name">
        <span>UPLAND</span>
      </div>
    </div>
  )
}


@inject(stores => ({
    menu: stores.menu
}))
@observer
class Bottom extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let menu = this.props.menu
    let icon = menu.collapse ? 'icon ion-chevron-right' : 'icon ion-chevron-left'
    return (
      <div className="bottom" onClick={menu.toggle}>
        <i className={icon}></i>
      </div>
    )
  }
}


@inject(stores => ({
    menu: stores.menu
}))
@observer
class Sidebar extends React.Component {
  constructor(props) {
    super(props)
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
      window.addEventListener('resize', this.props.menu.updateCollapse)
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.props.menu.updateCollapse)
  }

  render() {
    const style = this.props.menu.collapse ? 'side collapse' : 'side'
    return (
      <aside className={style}>
        <Logo />
        <div className="navgation">
          <Menu items={this.primaryMenus} />
          <Menu items={this.settingMenus} />
        </div>
        <Bottom/>
      </aside>
    )
  }

}

export default Sidebar