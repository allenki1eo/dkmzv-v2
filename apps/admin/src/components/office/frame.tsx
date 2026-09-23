import { getDictionary } from '@ebenezer/shared';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { StoneMark } from '@/components/brand/stone-mark';
import { ThemeSwitch } from '@/components/theme-switch';

const links = [
  ['/ofisi', 'dashboard'],
  ['/ofisi/waumini', 'members'],
  ['/ofisi/jumuiya', 'jumuiya'],
  ['/ofisi/mahubiri', 'sermons'],
  ['/ofisi/mubashara', 'live'],
  ['/ofisi/sadaka', 'finance'],
  ['/ofisi/matangazo', 'announcements'],
  ['/ofisi/kalenda', 'calendar'],
  ['/ofisi/mipangilio', 'settings'],
] as const;

export function OfficeFrame({
  name,
  season,
  children,
}: {
  name: string;
  season: string;
  children: ReactNode;
}) {
  const copy = getDictionary('sw');
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <div className="h-1.5 w-full" style={{ background: season }} />
      <div className="grid min-h-[calc(100dvh-6px)] md:grid-cols-[240px_1fr]">
        <aside className="border-b border-line bg-surface px-4 py-6 md:border-b-0 md:border-r">
          <Link href="/ofisi" className="flex items-center gap-3">
            <StoneMark size={36} />
            <span>
              <span className="block font-serif text-[20px] leading-none">{copy.appName}</span>
              <span className="text-[13px] text-ink-muted">{copy.admin.office}</span>
            </span>
          </Link>
          <nav className="mt-8 grid gap-1">
            {links.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-11 items-center rounded-[var(--radius-control)] px-3 text-[15px] hover:bg-bg"
              >
                {copy.admin[key]}
              </Link>
            ))}
            <Link
              href="/design"
              className="flex min-h-11 items-center rounded-[var(--radius-control)] px-3 text-[15px] text-ink-muted hover:bg-bg"
            >
              {copy.admin.design}
            </Link>
          </nav>
        </aside>
        <div>
          <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <p className="text-[15px]">{name}</p>
            <ThemeSwitch />
          </header>
          <div className="px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
