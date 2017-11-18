import React from 'react'
import { Link } from 'react-router-dom'

function MenuItem(props) {
  return (
    <Link to={props.value.url}>
      <i className={'icon fa ' + props.value.icon} aria-hidden="true"></i>
      <span>{props.value.name}</span>
    </Link>
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
    this.state = {collapse: this.getCollapse()}
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
    this.clickCollapse = this.clickCollapse.bind(this)
    this.updateCollapse = this.updateCollapse.bind(this)
  }

  getCollapse() {
    return window.innerWidth < 768 ? true : false
  }

  clickCollapse() {
    this.setState({collapse: !this.state.collapse})
  }

  updateCollapse() {
    this.setState({collapse: this.getCollapse()})
  }

  componentDidMount() {
      window.addEventListener('resize', this.updateCollapse)
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.updateCollapse)
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
          callback={this.clickCollapse}
        />
      </aside>
    )
  }

}

export default Sidebar