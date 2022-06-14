import Link from 'next/link'
import Container from './Container'
import cn from 'classnames'

export default function Alert({ preview }: { preview?: boolean }) {
  return (
    <div
      className={cn('border-b', {
        'border-accent-7 bg-accent-7 text-white': preview,
        'border-accent-2 bg-accent-1': !preview,
      })}
    >
      <Container>
        {preview ? (
          <div className="py-2 text-sm text-center">
            <>
              This page is a preview.{' '}
              <Link href="/api/exit-preview"><a
                
                className="underline transition-colors duration-200 hover:text-cyan"
              >
                Click here
              </a></Link>{' '}
              to exit preview mode.
            </>
          </div>
        ) : (
          <></>
        )}
      </Container>
    </div>
  )
}
