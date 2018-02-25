import React from 'react'
import { inject, observer } from 'mobx-react'

import moment from 'moment'


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
  return (
    <button type="button" className={'btn btn-' + props.type}>
    <span>{props.children}</span></button>
  )
}


@inject(stores => ({
    post: stores.post
}))
@observer
class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      next: {},
      prev: {},
    }

    this.renderItem = this.props.type === 'draft' ? this.draftItem : this.postItem
  }

  componentDidMount() {
    this.props.post.fetch()
  }

  // updatePosts() {
  //   this.updateApi().then((posts) => {
  //       let link = api.parseLink(posts.headers.link)
  //       this.setState({
  //         posts: posts.data,
  //         next: link.next || {},
  //         prev: link.prev || {},
  //       })
  //     })
  // }

  postItem(post) {
    return (
      <div key={post.id} className="post-item two-column">
        <div className="two-column-main">
          <a href={post.url} className="post-item-link">
            <strong>{post.title}</strong>
            <span>{post.headline}</span>
          </a>
          <div className="post-item-info">
            {post.metas.map((meta) =>
              <span key={meta.slug}>{meta.name}</span>
            )}
            <a href="">{moment(post.created).format('ll')}</a>
          </div>
        </div>
        <div className="two-column-action">
          <div className="post-item-views">
            <strong>{post.views}</strong> views
          </div>
        </div>
      </div>
    )
  }

  draftItem(post) {
    return (
      <div key={post.id} className="post-item two-column">
        <div className="two-column-main">
          <a href={post.url} className="post-item-link">
            <strong>{post.title}</strong>
          </a>
          <div className="post-item-info">
            {post.metas.map((meta) =>
              <span key={meta.slug}>{meta.name}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="content">
        {this.props.post.posts.map((post) =>
          this.renderItem(post)
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