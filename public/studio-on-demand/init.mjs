import { post, author } from './schema.mjs'
import { history } from './history.mjs'
import { name, projectId, dataset } from './config.mjs'
import { sanity } from './deps.mjs'

const { createConfig, renderStudio, deskTool } = sanity

const config = {
  basePath: '/',
  name,
  projectId,
  dataset,
  schema: { types: [post, author] },
  plugins: [deskTool()],
}
const studioConfig = createConfig(config)
const studio = renderStudio(document.getElementById('sanity'), studioConfig, {
  unstable_history: history,
  unstable_noAuthBoundary: true,
})

window.updateStudio = ({ config: _config, ...overrides }) => {
  studio.unstable_patch({
    unstable_history: history,
    unstable_noAuthBoundary: true,
    ...overrides,
    config: _config ? createConfig({ ...config, ..._config }) : studioConfig,
  })
}
console.group('Hi there!')
console.log(
  'This is an instance of Sanity Studio V3 running natively on ESM URL imports, no bundling involved or any loading runtimes.'
)
console.log('All native ✨')
console.log(
  'You can call `updateStudio` in your console to quickly try out different options.'
)
console.log(
  'Try changing the name of the studio by calling `updateStudio({config: {name: "I did the thing 🥳"}})`'
)
console.debug(config)
console.groupCollapsed()
