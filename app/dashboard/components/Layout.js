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


export {
  Section,
  MainContainer,
}