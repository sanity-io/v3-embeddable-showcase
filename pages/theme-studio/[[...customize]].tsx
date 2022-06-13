import Singularity from 'components/Singularity'
import StudioPage from 'components/StudioPage'

import { Studio } from 'sanity'
import { useEffect, useState } from 'react'
import config from 'sanity.config'

export default function ThemeStudioPage() {
  const [singularity, setSingularity] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = () => {
      const maybeSingularity = document.querySelectorAll(
        '[data-studio-preview]'
      )
      if (maybeSingularity.length > 3 && !singularity) {
        setSingularity(true)
      }
    }
    handler()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [singularity])

  return (
    <>
      <StudioPage>
        <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
      <Singularity singularity={singularity} />
    </>
  )
}
