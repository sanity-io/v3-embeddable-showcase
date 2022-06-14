import { createConfig } from 'sanity'
import { config as blogConfig } from 'components/studios/blog'
import { config as proBlogConfig } from 'components/studios/blog-pro'
import { config as maxProBlogConfig } from 'components/studios/blog-pro-max'
import { config as themerConfig } from 'components/studios/themer'

const workspaces = createConfig([
  // manage/blog
  blogConfig,
  // manage/blog-pro
  proBlogConfig,
  // manage/blog-max-pro
  maxProBlogConfig,
  // manage/themer
  themerConfig,
])

export default workspaces
