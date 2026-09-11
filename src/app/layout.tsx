import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Camper Anal', description: 'Mobile camper inspection notebook' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="border-b border-[var(--line)] bg-[var(--panel)]"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-bold tracking-tight">Camper Anal</Link><nav className="flex gap-2 text-sm font-sans"><Link className="rounded-full px-3 py-2 hover:bg-[var(--soft)]" href="/">Inspections</Link><Link className="rounded-full px-3 py-2 hover:bg-[var(--soft)]" href="/inspections/new">New inspection</Link><Link className="rounded-full px-3 py-2 hover:bg-[var(--soft)]" href="/compare">Compare</Link></nav></div></header><main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-6">{children}</main></body></html>;
}