import Singularity from 'components/Singularity'
import SanityCanvas from 'components/StudioPage'
import ThemeStudio from 'components/studios/theme'
import { useEffect, useState } from 'react'

export default function ThemeStudioPage() {
  const [singularity, setSingularity] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = () => {
      const maybeSingularity = document.querySelectorAll(
        '[data-sanity-studio-preview]'
      )
      console.log({ maybeSingularity })
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
      <SanityCanvas>
        <ThemeStudio />
      </SanityCanvas>
      <Singularity singularity={singularity} />
    </>
  )
}
