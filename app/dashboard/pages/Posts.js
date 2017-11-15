import React from 'react'

import { Main, Section, Button, Post} from '../components/Common'

class Posts extends React.Component {

  render() {
    const drafts = [
      {title: 'test', url: '/1', meta: 'Python'},
      {title: '丁香花开了', url: '/2', meta: 'Python'},
      {title: 'React 初探', url: '/3', meta: 'Python'},
    ]
    const posts = [
      {title: '这里的丁香已经盛开了', url: '/1', meta: 'Python', headline: '和三年前不一样了。但是总会有好起来的那一天。', created: 'May 30, 2017'},
      {title: '博客诞生记', url: '/1', meta: 'Python', headline: '终于写了个博客', created: 'May 30, 2017'},
      {title: '语法测试', url: '/1', meta: 'Python', headline: '仅是为了测试', created: 'May 30, 2017'},
    ]
    return (
      <Main>
          <Section 
            title="Drafts" 
            action={
              <Button text="New Post"/>
            }>
            <Post items={drafts} type='draft' />
          </Section>
          <Section title="Published">
            <Post items={posts} />
          </Section>
      </Main>
    )
  }

}

export default Posts