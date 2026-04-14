import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kharcha — Apna Ghar, Apna Hisaab',
  description: 'AI-powered smart shopping and life organiser for Indian households.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kharcha',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF9933',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Restore dark mode before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const s = localStorage.getItem('kharcha-ui');
                if (s && JSON.parse(s)?.state?.darkMode) {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
