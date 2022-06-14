import {config as blogConifg} from 'components/studios/blog'

export * from 'components/studios/blog'

export const config = {
  ...blogConifg,
  basePath: '/wp-admin/index_php',
  name: 'wordpress',
  title: 'WordPress',
}