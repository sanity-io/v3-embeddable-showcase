import Link from 'next/link'
import { StudioProvider, defaultTheme, StudioLayout } from 'sanity'
import config from 'sanity.config'
import { ThemeProvider, Button } from '@sanity/ui'
import { useMagicRouter } from 'hooks'
import { EditIcon } from '@sanity/icons'
import { useState } from 'react'
import { StyledBottomSHeet } from './Playground'

// If preview is on it also means we're authenticated, thanks to next-sanity checking that before attempting to stream groq
export function EditPost({ preview, _id }: { preview: boolean; _id: string }) {
  // Getting the entire Studio context provider is overkill, but is fast

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

let lastOpen = false
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
        onClick={() => {
          lastOpen = true
          setOpen(true)
        }}
      >
        <EditIcon /> Edit
      </Button>
      <StyledBottomSHeet
        blocking={false}
        scrollLocking={false}
        open={lastOpen && open && shouldBottomSheet}
        onDismiss={() => {
          setOpen(false)
          lastOpen = false
        }}
        defaultSnap={({ snapPoints, lastSnap }) =>
          lastSnap ?? Math.min(...snapPoints)
        }
        snapPoints={({ maxHeight }) => [maxHeight / 3, maxHeight - 64]}
      >
        <StudioProvider
          config={config}
          scheme="dark"
          unstable_history={history}
          unstable_noAuthBoundary
        >
          <div
            className="h-[number:var(--rsbs-overlay-h,100%)] min-h-[number:1px] w-full rounded-t-[calc(var(--rsbs-overlay-rounded)_-_3px)] opacity-[var(--rsbs-content-opacity)]"
            style={{ contain: 'strict' }}
          >
            <StudioLayout />
          </div>
        </StudioProvider>
      </StyledBottomSHeet>
    </>
  )
}
