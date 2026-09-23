import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonStyles = cva(
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        gold: 'bg-gold text-surface hover:opacity-90',
        quiet: 'bg-surface text-ink border border-line hover:bg-bg',
        danger: 'bg-danger text-surface',
      },
    },
    defaultVariants: { variant: 'gold' },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant }), className)} {...props} />;
}
