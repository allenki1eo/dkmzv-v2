'use client';

import { createTranslator } from '@ebenezer/shared';
import type { ThemePreference } from '@ebenezer/tokens';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/cn';

const options: ThemePreference[] = ['system', 'light', 'dark'];

export function ThemeSwitch({ locale = 'sw' }: { locale?: 'sw' | 'en' }) {
  const t = createTranslator(locale);
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label={t('theme.label')}
      className="inline-flex rounded-[var(--radius-chip)] border border-line bg-surface p-1"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={preference === option}
          onClick={() => setPreference(option)}
          className={cn(
            'min-h-10 min-w-20 rounded-[var(--radius-chip)] px-3 text-[13px]',
            preference === option ? 'bg-bg text-ink' : 'text-ink-muted',
          )}
        >
          {t(`theme.${option}`)}
        </button>
      ))}
    </div>
  );
}
