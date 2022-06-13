import favicon from 'public/sanity.svg'
import Head from 'next/head'

export default function SanityPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
        <meta
          name="theme-color"
          content="#101112"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="robots" content="noindex" />
        <title>Sanity Studio</title>
        <link rel="icon" href={favicon.src} />
      </Head>
      <main
        data-studio-canvas
        className="h-screen max-h-[length:100dvh] dark:bg-[#101112]"
      >
        {children}
      </main>
    </>
  )
}
