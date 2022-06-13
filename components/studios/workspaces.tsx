import {type Config} from 'sanity'
import {config as blogConfig} from 'components/studios/blog'
import {config as wordpressConfig} from 'components/studios/wordpress'

export const workspaces: Config[] = [blogConfig, wordpressConfig]