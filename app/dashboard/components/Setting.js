import React from 'react'

import { Section } from './Layout'


class Setting extends React.Component {

  render() {
    return (
      <div className="main">
        <div className="two-column navigation">
          <div className="two-column-main">
            <nav>
              <a href="#" className="router-link-exact-active router-link-active">Info</a>
              <a href="#">Profile</a>
              <a href="#">Links</a>
            </nav>
          </div>
        </div>
        <div className="container">
          <Section title="Settings">
          </Section>
        </div>
      </div>
    )
  }

}

export default Setting