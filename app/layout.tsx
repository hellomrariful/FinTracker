import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fintracker - Smart Financial Management for Digital Businesses',
  description: 'Take control of your finances with Fintracker. Track income, manage expenses, and gain valuable insights with our comprehensive financial management platform.',
  keywords: 'financial management, expense tracking, income tracking, business analytics, financial dashboard',
  authors: [{ name: 'Fintracker Team' }],
  openGraph: {
    title: 'Fintracker - Smart Financial Management',
    description: 'Take control of your finances with comprehensive tracking and analytics',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}