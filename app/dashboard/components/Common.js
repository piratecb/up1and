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


function Main(props) {
  return (
    <div className="main">
      <div className="container">
      {props.children}
      </div>
    </div>
  )
}

function Button(props) {
  const url = props.url || '#'
  const text = props.text || 'Button'
  return (
    <a href={url}>
    <button type="button" className="pure-button pure-button-primary">
    <span>{text}</span></button>
    </a>
  )
}

function PostItem(props) {
  const type = props.type === 'draft' ? 'draft' : 'post'
  if (props.type === 'draft') {
    return (
      <div className="post-item two-column">
        <div className="two-column-main">
          <a href={props.value.url} className="post-item-link">
            <strong>{props.value.title}</strong>
          </a>
          <div className="post-item-info">
            <span>{props.value.meta}</span>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="post-item two-column">
        <div className="two-column-main">
          <a href={props.value.url} className="post-item-link">
            <strong>{props.value.title}</strong>
            <span>{props.value.headline}</span>
          </a>
          <div className="post-item-info">
            <span>{props.value.meta}</span>
            <a href="">{props.value.created}</a>
          </div>
        </div>
        <div className="two-column-action">
          <div className="post-item-views">
            <strong>2</strong> views
          </div>
        </div>
      </div>
    )
  }

}

function Post(props) {
  return (
    <div className="content">
      {props.items.map((item) =>
        <PostItem key={item.title}
                  value={item} 
                  type={props.type} />
      )}
    </div>
  )
}

export {
  Section,
  Main,
  Button,
  Post,
}