import React from 'react'


function MenuItem(props) {
  return (
    <a href={props.value.url}>
      <i className={'icon fa ' + props.value.icon} aria-hidden="true"></i>
      <span>{props.value.name}</span>
    </a>
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

class Bottom extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.callback()
  }

  render() {
    const collapse = this.props.collapse
    if (collapse) {
      return (
        <div className="bottom" onClick={this.handleClick}>
          <i className="icon ion-chevron-right"></i>
        </div>
      )
    } else {
      return (
        <div className="bottom" onClick={this.handleClick}>
          <i className="icon ion-chevron-left"></i>
        </div>
      )
    }
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {collapse: false}
    this.primaryMenus = [
      {icon: 'ion-ios-home-outline', url: '#/home', name: 'Home'},
      {icon: 'ion-ios-list-outline', url: '#/home', name: 'Posts'},
      {icon: 'ion-ios-pricetag-outline', url: '#/home', name: 'Tags'},
      {icon: 'ion-ios-paper-outline', url: '#/home', name: 'Pages'}
    ]
    this.settingMenus = [
      {icon: 'ion-ios-settings', url: '#/home', name: 'Settings'},
      {icon: 'ion-log-out', url: '/logout', name: 'Logout'}
    ]
    this.collapseChange = this.collapseChange.bind(this)
  }

  collapseChange() {
    this.setState({collapse: !this.state.collapse})
  }

  render() {
    const collapseStyle = this.state.collapse ? 'side collapse' : 'side'
    return (
      <aside className={collapseStyle}>
        <Logo />
        <div className="navgation">
          <Menu items={this.primaryMenus} />
          <Menu items={this.settingMenus} />
        </div>
        <Bottom 
          collapse={this.state.collapse}
          callback={this.collapseChange}
        />
      </aside>
    )
  }

}

export default Sidebar