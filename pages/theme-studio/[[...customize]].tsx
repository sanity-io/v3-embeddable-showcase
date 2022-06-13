import Singularity from 'components/Singularity'
import StudioPage from 'components/StudioPage'
import ThemeStudio from 'components/studios/themer'
import { useEffect, useState } from 'react'

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
        <ThemeStudio />
      </StudioPage>
      <Singularity singularity={singularity} />
    </>
  )
}
