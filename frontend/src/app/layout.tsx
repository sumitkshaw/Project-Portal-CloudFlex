// frontend/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Portal',
  description: 'Manage projects and assign team members',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <ToastProvider />
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-primary-600">Project Portal</h1>
              <p className="text-gray-600">Manage projects and team assignments</p>
            </header>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}