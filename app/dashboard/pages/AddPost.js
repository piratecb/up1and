import React from 'react'
import { Redirect } from 'react-router-dom'

import { Main, Section, Button, Post} from '../components/Common'

import * as api from '../api'


class PostHeader extends React.Component {

  render() {
    return (
      <div className='writer-head'>
        <div className='writer-head-content'>
          <button type="button" className="btn btn-text btn-icon-only">
            <i className="icon ion-help-circled"></i>
          </button>
          <button type="button" className="btn btn-text btn-icon-only">
            <i className="icon ion-image"></i>
          </button>
          <button type="button" className="btn btn-text btn-icon-only">
            <i className="icon ion-pricetag"></i>
          </button>
        </div>
      </div>
    )
  }

}


class Writer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e){
    e.preventDefault()

    let data = {
      title: this.refs.title.value,
      headline: this.refs.headline.value,
      content: this.refs.content.value,
    }

    api.createPost(data).then((data) => {
      this.setState({ redirect: true })
    })
    
  }

  render() {
    return (
      <section className="writer-main">
        <form onSubmit={this.handleSubmit}>
          <div className="post-field title">
            <input placeholder="Title" type="text" ref="title" />
          </div>
          <div className="post-field headline">
            <input placeholder="Headline" type="text" ref="headline" />
          </div>
          <div className="post-field content">
            <textarea placeholder="Content" type="text" className='markdown-area' ref="content" />
          </div>
          <button type="submit" className="pure-button pure-button-primary">
            <span>Publish</span>
          </button>
        </form>
        {this.state.redirect && (
          <Redirect to='/posts'/>
        )}
      </section>
    )
  }

}


class addPost extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='main'>
        <PostHeader />
        <Writer />
      </div>
    )
  }

}

export default addPost