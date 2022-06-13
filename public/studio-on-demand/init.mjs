import { history } from './history.mjs'
import { sanity } from './deps.mjs'

export async function init(mountNode) {
  const { createConfig, renderStudio, deskTool } = sanity
  const basePath = location.pathname

  const { workspaces, schema } = await fetch('/api/studio/workspaces').then(
    (r) => r.json()
  )
  const { name, title, projectId, dataset } = workspaces.find(
    (workspace) => workspace.basePath === basePath
  )

  const config = createConfig([
    ...workspaces.filter((workspace) => workspace.basePath !== basePath),
    {
      basePath,
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
