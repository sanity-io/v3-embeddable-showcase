import { createConfig } from 'sanity'
import { config as blogConfig } from 'components/studios/blog'
import { config as blogWithPreviews } from 'components/studios/chapter-01'
import { config as wordpressConfig } from 'components/studios/wordpress'
import { config as themerConfig } from 'components/studios/themer'
import { projectId, dataset } from 'hooks/useSanityClient'

export default createConfig([
  blogConfig,
  blogWithPreviews,
  wordpressConfig,
  themerConfig,
  // May not work as it uses different routing
  {
    name: 'studio-on-demand',
    title: 'V3 + ESM = <3',
    basePath: '/studio-on-demand',
    dataset,
    projectId,
  },
])
