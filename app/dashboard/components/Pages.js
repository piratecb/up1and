import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer} from 'mobx-react'

import strftime from 'strftime'

import { Section } from './Layout'


class PageCard extends React.Component {

  render() {
    const page = this.props.page
    return (
      <div className="page-card">
        <div className="content">
          <div className="header">
            <Link to={`/page/${page.id}`}>
              {page.title}
            </Link>
          </div>
          <div className="meta">{strftime('%b %e, %Y', new Date(page.created))}</div>
          <div className="description">
            {page.content}
          </div>
        </div>
        <div className="extra">
            /{page.slug}
        </div>
      </div>
    )
  }

}


@inject('pageStore')
@observer
class Pages extends React.Component {

  componentDidMount() {
    this.props.pageStore.fetch()
    document.title = 'Pages'
  }

  render() {
    const button = (
      <Link to="/page">
        <button type="button" className="btn btn-primary">
          <span>New Page</span>
        </button>
      </Link>
    )
    const pages = this.props.pageStore.pages
    return (
      <div className="main">
        <div className="container">
          <Section title="Pages" action={button}>
            <div className="content">
              {pages.map((page) =>
                <PageCard key={page.id} page={page} />
              )}
            </div>
          </Section>
        </div>
      </div>
    )
  }

}

export default Pages