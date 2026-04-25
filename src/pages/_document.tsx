import Document, { Head, Html, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="favicon.png" type="img/png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@500;600;700&family=Geist:wght@400;500;600;700&family=Inter:wght@600;700;800&family=Roboto:wght@300;500;700&display=swap"
            rel="stylesheet"
          />
          <title>github-search</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
