import { ServerStyleSheet } from 'styled-components'
import NextDocument, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
} from 'next/document'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await NextDocument.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const sheet = new ServerStyleSheet()
    const main = sheet.collectStyles(<Main />)
    const styleTags = sheet.getStyleElement()

    return (
      <Html className="overscroll-none">
        <Head>{styleTags}</Head>
        <body className="m-0 overscroll-none">
          {main}
          <NextScript />
        </body>
      </Html>
    )
  }
}
