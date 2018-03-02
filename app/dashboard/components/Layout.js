import React from 'react'


function Section(props) {
  return (
    <section className="section">
      <div className="two-column">
        <div className="two-column-main">
          <h2>{props.title}</h2>
        </div>
        <div className="two-column-action">
          {props.action}
        </div>
      </div>
      {props.children}
    </section>
  )
}


function MainContainer(props) {
  return (
    <div className="main">
      <div className="container">
      {props.children}
      </div>
    </div>
  )
}


class Tab extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  handleTabClick(event) {
    event.preventDefault();
    this.props.onClick(this.props.tabIndex)
  }

  render() {
    return (
      <li className="tab">
        <a className={`tab-link ${this.props.linkClassName} ${this.props.isActive ? 'active' : ''}`}
           onClick={this.handleTabClick}>
          {this.props.text}
        </a>
      </li>
    );
  }
}


class Tabs extends React.Component {

  // How to use
  // <Tabs>
  //   <Tab text={'title'}
  //        linkClassName={'custom-link'}>
  //     <p>content</p>
  //   </Tab>
  // <Tabs>
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeTabIndex: this.props.defaultTabIndex ? this.props.defaultTabIndex : 0
    };
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  handleTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        onClick : this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex
      })
    })
  }

  // Render current active tab content
  renderActiveTabContent() {
    const {children} = this.props
    const {activeTabIndex} = this.state
    if(children[activeTabIndex]) {
      return children[activeTabIndex].props.children
    }
  }

  render() {
    return (
      <div className="tabs">
        <ul className="tabs-nav nav navbar-nav navbar-left">
          {this.renderChildrenWithTabsApiAsProps()}
        </ul>
        <div className="tabs-active-content">
          {this.renderActiveTabContent()}
        </div>
      </div>
    )
  }
}

export {
  Section,
  MainContainer,
  Tab,
  Tabs,
}