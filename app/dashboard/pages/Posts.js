import React from 'react'

import { Main, Section, Button, Post} from '../components/Common'

class Posts extends React.Component {

  render() {
    return (
      <Main>
          <Section 
            title='Drafts' 
            action={
              <Button text='New Post' url='/post-draft'/>
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