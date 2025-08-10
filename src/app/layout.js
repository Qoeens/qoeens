import './globals.css'
import SupabaseProvider from '../context/SupabaseProvider'

export const metadata = {
  title: 'Qoeens',
  description: 'Minimal Twitter Clone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
