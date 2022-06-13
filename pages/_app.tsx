import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
  // @TODO move studio meta out of _app
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
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
