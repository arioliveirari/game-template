import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleAnalytics } from '@next/third-parties/google'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" as="font" href="/fonts/Quicksand.otf" type="font/otf" />
        <script async src="/js/gtm.js"></script>
        <link rel="manifest" href="manifest.json" />
      </Head>   
      <body>
        <Main />
        <NextScript />
        <div style={{ fontFamily: 'Quicksand' }}></div>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P45VRXKW"
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
      </body>
    </Html>
  )
}
