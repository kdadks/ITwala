import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="ITwala Academy - Innovate today for better tomorrow. IT training courses specializing in Product Management, Software Development, Testing, and AI." />
        <meta property="og:title" content="ITwala Academy - IT Training Courses" />
        <meta property="og:description" content="Specialized IT training for career advancement. Learn from industry professionals with real-world experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com" />
        <link rel="icon" type="image/png" href="/images/IT - WALA_logo (1).png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}