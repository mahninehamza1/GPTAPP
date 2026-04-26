import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agency Brief Generator',
  description: 'Client-facing strategic brief collection and generator tool.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
