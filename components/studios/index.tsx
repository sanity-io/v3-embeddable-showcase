import { type WorkspaceOptions, Config } from 'sanity'
import * as blogStudio from './blog'
import * as wordpressStudio from './wordpress'

export type StudioKey =
  | 'blog'
  | 'wordpress'
  | 'themer'

export function getCreateStudioConfig(
  studioKey: StudioKey
): (workspace: WorkspaceOptions) => Config {
  switch (studioKey) {
    case 'blog':
      return blogStudio.createStudioConfig
    case 'wordpress':
      return wordpressStudio.createStudioConfig
    default:
      throw new Error(`Studio ${studioKey} not found`)
  }
}

