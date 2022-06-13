//import SanityCanvas from 'components/StudioCanvas'
import StudioPage from 'components/StudioPage'

// Takes care of rendering an entire Sanity Studio page, this method have the least amount of overrides
// such as unstable_history and have the least probability of breaking.

export default function StudioPageLoader() {
  return (
    <>
      {/* <SanityCanvas> */}
      <StudioPage>TODO</StudioPage>
      {/* </SanityCanvas> */}
    </>
  )
}
