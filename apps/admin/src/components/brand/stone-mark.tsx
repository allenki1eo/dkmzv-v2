import { cn } from '@/lib/cn';

type StoneMarkProps = {
  className?: string;
  size?: number;
};

/** Standing marker with a thin light on stone — not a clip-art cross. */
export function StoneMark({ className, size = 56 }: StoneMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('text-ink', className)}
      aria-hidden
    >
      <rect x="18" y="14" width="22" height="38" rx="3" fill="currentColor" opacity="0.88" />
      <path
        d="M12 10 L28 18"
        stroke="var(--gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="10" r="2.2" fill="var(--gold-leaf)" />
    </svg>
  );
}
