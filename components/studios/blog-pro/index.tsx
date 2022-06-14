import { projectId, dataset } from 'hooks/useSanityClient'
import { type WorkspaceOptions } from 'sanity'
import BlogPreviewWrapper from './BlogPreviewWrapper'
import { RobotIcon } from '@sanity/icons'
import { Card, Flex } from '@sanity/ui'

import {
  DefaultDocumentNodeResolver,
  deskTool,
  View,
  ViewBuilder,
} from 'sanity/desk'
import HeroPost from 'components/blog/HeroPost'
import Avatar from 'components/blog/Avatar'
import MoreStories from 'components/blog/MoreStories'
import PostHeader from 'components/blog/PostHeader'
import PostBody from 'components/blog/PostBody'
import { types, productionUrl } from 'components/studios/blog'

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

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
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
  if (schemaType === 'author') {
    views.push(
      S.view
        .component(({ document }) => (
          <Card padding={6}>
            <Flex justify="center">
              <Avatar
                name={document.name || 'Untitled'}
                picture={document.picture}
              />
            </Flex>
          </Card>
        ))
        .id('avatar-preview')
        .title('Avatar')
    )
  }

  return S.document().views(views)
}

export const config: WorkspaceOptions = {
  basePath: '/manage/blog-pro',
  icon: RobotIcon,
  projectId,
  dataset,
  plugins: [deskTool({ defaultDocumentNode })],
  name: 'blog-pro',
  title: 'Pro Blog',
  schema: { types },
  document: { productionUrl },
}
