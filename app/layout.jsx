import './globals.css'
import Providers from './components/Providers'

export const metadata = {
  title: 'Museum of Woods — Precision Engraved Wood Objects',
  description:
    'Where wood becomes memory. Precision laser-engraved objects shipped worldwide. Each piece carries a story that outlasts its maker.',
  keywords: 'laser engraved wood, personalised wood gifts, wooden signs, soundwave art, memorial wood, custom engraving, worldwide shipping',
  openGraph: {
    title: 'Museum of Woods',
    description: 'Where wood becomes memory.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2318',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('mow-theme')==='day')document.documentElement.classList.add('day')}catch(e){}`
          }}
        />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
