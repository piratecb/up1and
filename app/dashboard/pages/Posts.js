import React from 'react'
import { Link } from 'react-router-dom'

import { Main, Section, Button, Post} from '../components/Common'

class Posts extends React.Component {

  render() {
    return (
      <Main>
          <Section 
            title='Drafts' 
            action={
              <Link to='/post-draft'><Button type='primary'>New Post</Button></Link>
            }>
            <Post type='draft' />
          </Section>
          <Section title="Published">
            <Post />
          </Section>
      </Main>
    )
  }

}

export default Posts