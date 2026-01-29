import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { PresenceProvider } from '@/context/PresenceContext';
import { HouseModeProvider } from '@/context/HouseModeContext';
import { UXDataProvider } from '@/context/UXDataContext';
import { AppShell } from '@/core/layout/AppShell';
import { DebugPanel } from '@/ui/DebugPanel';
import { WorldContextPanel } from '@/ui/components/WorldHeader/WorldContextPanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATLAS Home Control',
  description: 'Modular Home Assistant Interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <PresenceProvider>
            <HouseModeProvider>
              <UXDataProvider>
                <AppShell>{children}</AppShell>
                <WorldContextPanel />
                <DebugPanel />
              </UXDataProvider>
            </HouseModeProvider>
          </PresenceProvider>
        </AppProvider>
      </body>
    </html>
  );
}
