// An iframe sandbox, suitable for embedding Studio in smaller sizes than 100vu

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components'

export default function Sandbox({
  children,
  src,
  ...props
}: {
  children?: React.ReactNode
  src?: string
}) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const mountNode = contentRef?.contentWindow?.document?.body
  const cssNode = contentRef?.contentDocument?.head

  return (
    <iframe
      ref={setContentRef}
      className="h-[number:var(--rsbs-overlay-h,100%)] min-h-[number:1px] w-full rounded-t-[calc(var(--rsbs-overlay-rounded)_-_5px)]"
      frameBorder={0}
      {...props}
      src={src}
    >
      {mountNode && (
        <>
          <StyleSheetManager target={cssNode}>
            <>{createPortal(children, mountNode)}</>
          </StyleSheetManager>
        </>
      )}
    </iframe>
  )
}
