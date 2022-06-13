import { history as _history } from './deps.mjs'

const { createMemoryHistory } = _history
const history = createMemoryHistory({
  initialEntries: [
    window.history.state?.['studio-on-demand']?.location?.pathname || '/desk',
  ],
})

// Overriding listen to workaround a problem where native history provides history.listen(location => void), but the npm package is history.listen(({action, location}) => void)
const _listen = history.listen.bind(history)
history.listen = (listener) => {
  return _listen(({ action, location }) => {
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

export { history }
