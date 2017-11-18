import React from 'react'
import moment from 'moment'

import * as api from '../api.js'


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
          <a href={props.post.url} className="post-item-link">
            <strong>{props.post.title}</strong>
          </a>
          <div className="post-item-info">
            {props.post.metas.map((meta) =>
              <span key={meta.slug}>{meta.name}</span>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="post-item two-column">
        <div className="two-column-main">
          <a href={props.post.url} className="post-item-link">
            <strong>{props.post.title}</strong>
            <span>{props.post.headline}</span>
          </a>
          <div className="post-item-info">
            {props.post.metas.map((meta) =>
              <span key={meta.slug}>{meta.name}</span>
            )}
            <a href="">{moment(props.post.created).format('ll')}</a>
          </div>
        </div>
        <div className="two-column-action">
          <div className="post-item-views">
            <strong>{props.post.views}</strong> views
          </div>
        </div>
      </div>
    )
  }

}


class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      next: {},
      prev: {},
    }
  }

  componentDidMount() {
    const func = this.props.type === 'draft' ? api.fetchDrafts : api.fetchPosts
    func().then((posts) => {
        let link = api.parseLink(posts.headers.link)
        this.setState({
          posts: posts.data,
          next: link.next || {},
          prev: link.prev || {},
        })
      })
  }

  render() {
    return (
      <div className="content">
        {this.state.posts.map((post) =>
          <PostItem key={post.id}
                    post={post} 
                    type={this.props.type} />
        )}
      </div>
    )
  }

}

export {
  Section,
  Main,
  Button,
  Post,
}