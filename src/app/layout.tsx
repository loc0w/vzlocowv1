// src/app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from "@/components/Providers";


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PriceScanner - Amazon Price Tracking',
  description: 'Track Amazon prices easily with PriceScanner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}