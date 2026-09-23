import type { Metadata } from 'next';
import { Hanken_Grotesk, Literata } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TrpcProvider } from '@/components/trpc-provider';
import './globals.css';

const sans = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken',
  display: 'swap',
});

const serif = Literata({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-literata',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ofisi ya Ebenezer',
  description: 'Ofisi ya KKKT Usharika wa Ebenezer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const key = 'ebenezer-theme';
              const pref = localStorage.getItem(key) || 'system';
              const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
              if (dark) document.documentElement.classList.add('dark');
            })();`,
          }}
        />
      </head>
      <body
        className="min-h-dvh bg-bg text-ink antialiased"
        style={{
          fontFamily: 'var(--font-hanken), var(--font-sans)',
        }}
      >
        <style>{`
          :root {
            --font-sans: var(--font-hanken), 'Hanken Grotesk', sans-serif;
            --font-serif: var(--font-literata), Literata, serif;
          }
        `}</style>
        <ThemeProvider>
          <TrpcProvider>{children}</TrpcProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
