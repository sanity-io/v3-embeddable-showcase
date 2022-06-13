import { createStudioConfig } from 'components/studios/blog'
import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'

import { useBasePath } from 'hooks'
import { DefaultDocumentNodeResolver, deskTool, View, ViewBuilder } from 'sanity/desk'
import HeroPost from 'components/blog/HeroPost'
import BlogPreviewWrapper from 'components/studios/chapter-01/BlogPreviewWrapper'
import PostPreview from 'components/blog/PostPreview'
import MoreStories from 'components/blog/MoreStories'
import PostHeader from 'components/blog/PostHeader'
import { cover } from 'polished'
import PostBody from 'components/blog/PostBody'

const MorePreview = (props) => {
  return <MoreStories posts={[props]} />
}

const DetailPreview = ({title, date, slug, excerpt, coverImage, author, content}) => {
  return <>
    <PostHeader author={author} coverImage={coverImage} title={title} date={date} />
    <PostBody content={content} />
  </>
}

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const views: (View | ViewBuilder)[] = [];

  views.push(S.view.form());

  if (schemaType === 'post') {
    // views.push(S.view.component(({ document: { displayed: { title, date, slug, excerpt}} }) => 
    //  <HeroPost title={title} date={date} excerpt={excerpt} slug={slug.current} />
    // ).id('hero-preview').title('Hero'))
    views.push(S.view.component(({document}) => <BlogPreviewWrapper document={document} Component={HeroPost} />).id('hero-preview').title('Hero'))
    views.push(S.view.component(({document}) => <BlogPreviewWrapper document={document} Component={MorePreview} />).id('more-preview').title('More'))
    views.push(S.view.component(({document}) => <BlogPreviewWrapper document={document} Component={DetailPreview} />).id('detail-preview').title('Detail'))
  
  }

  return S.document().views(views) 
}

export default function StudioRoute() {
  const basePath = useBasePath()
  const config = useMemo(() => createStudioConfig({ basePath, plugins: [deskTool({defaultDocumentNode})] }), [basePath])
  return (
    <StudioPage>
      <Studio config={config} />
    </StudioPage>
  )
}
