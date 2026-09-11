'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [{ href: '/', label: 'Inspections' }, { href: '/compare', label: 'Compare' }];
export default function Navigation() { const pathname = usePathname(); return <nav aria-label="Primary navigation" className="app-nav">{items.map((item) => { const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); return <Link key={item.href} aria-current={active ? 'page' : undefined} className="app-nav-link" href={item.href}>{item.label}</Link>; })}<Link className="app-nav-primary" href="/inspections/new">New inspection <span aria-hidden="true" className="ml-2">↗</span></Link></nav>; }