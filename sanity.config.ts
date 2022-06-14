import { createConfig } from 'sanity'
import { config as blogConfig } from 'components/studios/blog'
import { config as proBlogConfig } from 'components/studios/blog-pro'
import { config as maxProBlogConfig } from 'components/studios/blog-pro-max'
import { config as themerConfig } from 'components/studios/themer'
import { projectId, dataset } from 'hooks/useSanityClient'

const workspaces = createConfig([
  // manage/blog
  blogConfig,
  // manage/blog-pro
  proBlogConfig,
  // manage/blog-max-pro
  maxProBlogConfig,
  // manage/themer
  themerConfig,
  // May not work as it uses different routing
  {
    name: 'studio-on-demand',
    title: 'V3 + ESM = <3',
    basePath: '/__native-esm__/desk.html',
    dataset,
    projectId,
  },
])

export default workspaces
