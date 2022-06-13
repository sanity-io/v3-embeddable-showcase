import { createConfig } from 'sanity'
import { config as blogConfig } from 'components/studios/blog'
import { config as blogWithPreviews } from 'components/studios/chapter-01'
import { config as wordpressConfig } from 'components/studios/wordpress'
import { config as themerConfig } from 'components/studios/themer'

export default createConfig([
  blogConfig,
  blogWithPreviews,
  wordpressConfig,
  themerConfig,
])