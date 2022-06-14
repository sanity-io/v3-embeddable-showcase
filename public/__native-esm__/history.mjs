import { history as _history } from './deps.mjs'

export function createHistory(basePath) {
  const { createMemoryHistory } = _history
  const history = createMemoryHistory({
    initialEntries: [
      window.history.state?.['studio-on-demand']?.location?.pathname || '/',
    ],
  })

  // Overriding listen to workaround a problem where native history provides history.listen(location => void), but the npm package is history.listen(({action, location}) => void)
  const _listen = history.listen.bind(history)
  history.listen = (listener) => {
    return _listen(({ action, location }) => {
      if (!location.pathname.startsWith(basePath)) {
        // Handle the case where the routing gets stuck as ESM uses in-memory, the rest uses browserHistory
        window.location.href = `${location.pathname}${location.search}${location.hash}`
        return
      }
      listener(location)
      // Store the location on the browser history to allow restoring it
      const prev = window.history.state || {}
      window.history.replaceState(
        { ...prev, ['studio-on-demand']: { location } },
        '',
        window.location.href
      )
    })
  }

  return history
}
