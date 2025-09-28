import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '../components/Navigation';
import SessionProvider from '../components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stock Management',
  description: 'Manage products and categories',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navigation />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}