import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Erwin - Personal Portfolio',
  description: 'Senior Software Engineer with industry experience since 2012.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1.0"
        />
        <meta name="version" content={new Date().toISOString()} />
        {/* this works because of rule "@next/next/no-sync-scripts" is disabled */}
        <script src="/initializer-theme.js" />
      </head>

      {/* NOTE: need relative in body and overflow-x-hidden to avoid horizontal scrolling on mobile */}
      <body
        className={`${inter.className} relative flex min-h-screen flex-col overflow-x-hidden bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
