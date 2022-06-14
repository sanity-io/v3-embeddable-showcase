import Singularity from 'components/Singularity'

import { useEffect, useState } from 'react'
import ManageWorkspace, { type Props } from '../[[...workspace]]'


export { getInitialProps } from '../[[...workspace]]'

// Reuse getInitialProps from parent, and wrap parent for max code reuse

//TODO move logic out, it only executes on initial page load. If 
// Studio routing triggers it then next won't see it
export default function ThemerWorkspace(props: Props) {
  console.log('ManageWorkspace Yes!')
  
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
      <ManageWorkspace {...props} />
      <Singularity singularity={singularity} />
    </>
  )
}