import { createStudioConfig } from 'components/studios/blog'
import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'

import { useBasePath } from 'hooks'
import { DefaultDocumentNodeResolver, deskTool, View, ViewBuilder } from 'sanity/desk'
import HeroPost from 'components/blog/HeroPost'
import BlogPreviewWrapper from 'components/studios/chapter-01/BlogPreviewWrapper'
import PostPreview from 'components/blog/PostPreview'

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const views: (View | ViewBuilder)[] = [];

  views.push(S.view.form());

  if (schemaType === 'post') {
    // views.push(S.view.component(({ document: { displayed: { title, date, slug, excerpt}} }) => 
    //  <HeroPost title={title} date={date} excerpt={excerpt} slug={slug.current} />
    // ).id('hero-preview').title('Hero'))
    views.push(S.view.component(({document}) => <BlogPreviewWrapper document={document} Component={HeroPost} />).id('hero-preview').title('Hero'))
    views.push(S.view.component(({document}) => <BlogPreviewWrapper document={document} Component={PostPreview} />).id('more-preview').title('More'))
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
