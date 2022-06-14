import { createHistory } from './history.mjs'
import { sanity } from './deps.mjs'

export async function init(mountNode) {
  const name = 'studio-on-demand'
  const { createConfig, renderStudio, deskTool } = sanity

  const { workspaces, schema } = await fetch('/api/studio/workspaces').then(
    (r) => r.json()
  )
  const { title, projectId, dataset, basePath } = workspaces.find(
    (workspace) => workspace.name === name
  )

  const history = createHistory(basePath)
  const config = createConfig([
    ...workspaces
      .filter((workspace) => workspace.name !== name)
      .map((workspace) => ({
        ...workspace,
        basePath: '/' + workspace.basePath.split('/')[2],
      })),
    {
      basePath: '/',
      title,
      name,
      projectId,
      dataset,
      schema,
      plugins: [deskTool()],
      unstable_history: history,
    },
  ])
  const studio = renderStudio(mountNode, config, {
    unstable_history: history,
    unstable_noAuthBoundary: true,
  })

  window.updateStudio = (overrides) => {
    studio.unstable_patch({
      unstable_history: history,
      unstable_noAuthBoundary: true,
      config,
      ...overrides,
    })
  }
  console.group('Hi there!')
  console.log(
    'This is an instance of Sanity Studio V3 running natively on ESM URL imports, no bundling involved.'
  )
  console.log('All native ✨')
  console.log(
    'You can call `updateStudio` in your console to quickly try out different options.'
  )
  console.log(
    'Try changing the name of the studio by calling `updateStudio({config: {name: "I did the thing 🥳"}})`'
  )
  console.debug({ config })
  console.groupEnd()
}
