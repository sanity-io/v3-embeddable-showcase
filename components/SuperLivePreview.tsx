import Link from 'next/link'
import { StudioProvider, defaultTheme } from 'sanity'
import { config } from 'components/studios/blog'
import { ThemeProvider, Button } from '@sanity/ui'
import { useMagicRouter } from 'hooks'
import { EditIcon } from '@sanity/icons'

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
  const history = useMagicRouter('/')

  return (
    <>
      <Button>Edit now</Button>
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
    </>
  )
}
