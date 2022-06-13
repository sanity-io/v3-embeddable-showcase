import workspaces from 'sanity.config'
import { types } from 'components/studios/blog'
import type { NextApiRequest, NextApiResponse } from 'next'

type Workspace = typeof workspaces[0]
type ResponseData = {
  workspaces: Pick<
    Workspace,
    'name' | 'title' | 'basePath' | 'projectId' | 'dataset'
  >[]
  schema: { types: typeof types }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({
    workspaces: workspaces.map(
      ({ name, title, basePath, projectId, dataset }) => ({
        name,
        title,
        basePath,
        projectId,
        dataset,
      })
    ),
    schema: { types },
  })
}
