import Link from 'next/link'
import { StudioProvider, defaultTheme } from 'sanity'
import { config } from 'components/studios/blog'
import { ThemeProvider, Button } from '@sanity/ui'
import { useMagicRouter } from 'hooks'
import { EditIcon } from '@sanity/icons'
import { useState } from 'react'
import { StyledBottomSHeet } from './Playground'

// If preview is on it also means we're authenticated, thanks to next-sanity checking that before attempting to stream groq
export function EditPost({ preview, _id }: { preview: boolean; _id: string }) {
  // Getting the entire Studio context provider is overkill, but is fast

  const editLabel = <>icon</>
  return (
    <ThemeProvider theme={defaultTheme} scheme="light">
      {!preview && <EditPostLink _id={_id} />}
      {preview && <EditPostButton _id={_id} />}
    </ThemeProvider>
  )
}

function EditPostLink({ _id }: { _id: string }) {
  return (
    <Link href={`/manage/blog/desk/post;${_id}/posts/`} passHref>
      <Button radius={2} tone="primary" mode="bleed" size={1} as="a">
        <EditIcon /> Edit
      </Button>
    </Link>
  )
}

function EditPostButton({ _id }: { _id: string }) {
  const history = useMagicRouter(`/manage/blog/desk/post;${_id}/posts/`)
  const shouldBottomSheet = true
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        radius={2}
        tone="primary"
        mode="bleed"
        size={1}
        onClick={() => setOpen(true)}
      >
        <EditIcon /> Edit
      </Button>
      <StyledBottomSHeet
        open={shouldBottomSheet && open}
        onDismiss={() => setOpen(false)}
        defaultSnap={({ snapPoints, lastSnap }) =>
          lastSnap ?? Math.max(...snapPoints)
        }
        snapPoints={({ maxHeight }) => [maxHeight / 3, maxHeight - 64]}
      >
        <StudioProvider
          config={config}
          scheme="light"
          unstable_history={history}
          unstable_noAuthBoundary
        >
          Insert bottom sheet here on mobile
          <br />
          PiP on desktop
        </StudioProvider>
      </StyledBottomSHeet>
    </>
  )
}
