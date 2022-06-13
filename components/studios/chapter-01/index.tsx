import { projectId, dataset } from 'hooks/useSanityClient'
import { type WorkspaceOptions } from 'sanity'
import BlogPreviewWrapper from "./BlogPreviewWrapper";
import { config as blogConfig } from 'components/studios/blog'
import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio, createConfig } from 'sanity'

import { useBasePath } from 'hooks'
import {
  DefaultDocumentNodeResolver,
  deskTool,
  View,
  ViewBuilder,
} from 'sanity/desk'
import HeroPost from 'components/blog/HeroPost'
import PostPreview from 'components/blog/PostPreview'
import MoreStories from 'components/blog/MoreStories'
import PostHeader from 'components/blog/PostHeader'
import { cover } from 'polished'
import PostBody from 'components/blog/PostBody'
import {types} from 'components/studios/blog'


// @ts-expect-error
const MorePreview = (props) => {
  return <MoreStories posts={[props]} />
}

const DetailPreview = ({
  // @ts-expect-error
  title,
  // @ts-expect-error
  date,
  // @ts-expect-error
  slug,
  // @ts-expect-error
  excerpt,
  // @ts-expect-error
  coverImage,
  // @ts-expect-error
  author,
  // @ts-expect-error
  content,
}) => {
  return (
    <>
      <PostHeader
        author={author}
        coverImage={coverImage}
        title={title}
        date={date}
      />
      <PostBody content={content} />
    </>
  )
}

const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  const views: (View | ViewBuilder)[] = []

  views.push(S.view.form())

  if (schemaType === 'post') {
    // views.push(S.view.component(({ document: { displayed: { title, date, slug, excerpt}} }) =>
    //  <HeroPost title={title} date={date} excerpt={excerpt} slug={slug.current} />
    // ).id('hero-preview').title('Hero'))
    views.push(
      S.view
        .component(({ document }) => (
          <BlogPreviewWrapper document={document} Component={HeroPost} />
        ))
        .id('hero-preview')
        .title('Hero')
    )
    views.push(
      S.view
        .component(({ document }) => (
          <BlogPreviewWrapper document={document} Component={MorePreview} />
        ))
        .id('more-preview')
        .title('More')
    )
    views.push(
      S.view
        .component(({ document }) => (
          <BlogPreviewWrapper document={document} Component={DetailPreview} />
        ))
        .id('detail-preview')
        .title('Detail')
    )
  }

  return S.document().views(views)
}

export const config: WorkspaceOptions = {
  basePath: '/chapter-01',
  projectId,
  dataset,
  plugins: [deskTool({ defaultDocumentNode })],
  name: 'blog-previews',
  title: 'Blog with Previews',
  schema: { types },
}
