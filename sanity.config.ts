import { createConfig } from 'sanity'
import { config as blogConfig } from 'components/studios/blog'
import { config as blogWithPreviews } from 'components/studios/blog-pro'
import { config as wordpressConfig } from 'components/studios/wordpress'
import { config as themerConfig } from 'components/studios/themer'
import { projectId, dataset } from 'hooks/useSanityClient'

export default createConfig([
  // manage/blog
  blogConfig,
  // manage/blog-pro
  blogWithPreviews,
  // manage/blog-max-pro
  // wp-admin/index.php
  wordpressConfig,
  // manage/themer
  themerConfig,
  // May not work as it uses different routing
  {
    name: 'studio-on-demand',
    title: 'V3 + ESM = <3',
    basePath: '/__native-esm__/studio',
    dataset,
    projectId,
  },
])
