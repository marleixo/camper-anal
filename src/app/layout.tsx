import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = { title: 'Camper Anal', description: 'Mobile camper inspection notebook' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="app-header"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight"><span className="app-brand-mark">C</span><span>Camper Anal</span></Link><Navigation /></div></header><main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-8 sm:py-12">{children}</main></body></html>;
}