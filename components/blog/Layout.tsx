import Alert from './Alert'
import Footer from './Footer'
import Meta from './Meta'

export default function Layout({
  preview,
  children,
}: {
  preview: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
