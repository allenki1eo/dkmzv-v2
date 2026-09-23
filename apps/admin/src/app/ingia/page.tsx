'use client';

import { createTranslator } from '@ebenezer/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StoneMark } from '@/components/brand/stone-mark';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/field';
import { trpc } from '@/lib/trpc';

export default function IngiaPage() {
  const t = createTranslator('sw');
  const router = useRouter();
  const [mode, setMode] = useState<'phone' | 'office'>('office');
  const [phone, setPhone] = useState('0712000001');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('mchungaji@ebenezer.or.tz');
  const [password, setPassword] = useState('JiweLaMsaada2026');
  const [step, setStep] = useState<'start' | 'code'>('start');
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const requestOtp = trpc.auth.requestOtp.useMutation();
  const verifyOtp = trpc.auth.verifyOtp.useMutation();
  const officeLogin = trpc.auth.officeLogin.useMutation();

  async function persist(token: string) {
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    router.push('/ofisi');
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-6 py-12">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <StoneMark size={48} />
          <p className="mt-5 font-serif text-[28px] leading-tight">{t('auth.title')}</p>
          <p className="mt-2 max-w-sm text-ink-muted">{t('churchName')}</p>
        </div>
        <ThemeSwitch />
      </div>

      <div className="rounded-[var(--radius-sheet)] border border-line bg-surface p-6">
        <p className="font-serif text-[20px]">{t('admin.office')}</p>
        <p className="mt-2 text-ink-muted">{t('auth.subtitle')}</p>

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant={mode === 'office' ? 'gold' : 'quiet'}
            onClick={() => setMode('office')}
          >
            {t('auth.officeLogin')}
          </Button>
          <Button
            type="button"
            variant={mode === 'phone' ? 'gold' : 'quiet'}
            onClick={() => setMode('phone')}
          >
            {t('auth.memberLogin')}
          </Button>
        </div>

        {mode === 'office' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              try {
                const result = await officeLogin.mutateAsync({ email, password });
                await persist(result.token);
              } catch (err) {
                setError(err instanceof Error ? err.message : t('states.error'));
              }
            }}
          >
            <div>
              <Label htmlFor="email">{t('auth.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={officeLogin.isPending}>
              {t('auth.officeLogin')}
            </Button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              try {
                if (step === 'start') {
                  const sent = await requestOtp.mutateAsync({ phone, locale: 'sw' });
                  setDevCode(sent.dev ?? null);
                  setStep('code');
                  return;
                }
                const verified = await verifyOtp.mutateAsync({ phone, code });
                if (verified.needsName) {
                  setError('Andika jina lako kisha thibitisha tena.');
                  return;
                }
                await persist(verified.token);
              } catch (err) {
                setError(err instanceof Error ? err.message : t('states.error'));
              }
            }}
          >
            <div>
              <Label htmlFor="phone">{t('auth.phoneLabel')}</Label>
              <Input
                id="phone"
                inputMode="tel"
                placeholder={t('auth.phonePlaceholder')}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            {step === 'code' ? (
              <div>
                <Label htmlFor="code">{t('auth.codeLabel')}</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
                {devCode ? (
                  <p className="mt-2 text-[13px] text-ink-muted">
                    {t('auth.devCodeHint', { code: devCode })}
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full"
              disabled={requestOtp.isPending || verifyOtp.isPending}
            >
              {step === 'start' ? t('auth.sendCode') : t('auth.verify')}
            </Button>
          </form>
        )}

        {error ? <p className="mt-4 text-[15px] text-danger">{error}</p> : null}
      </div>

      <p className="mt-8 font-serif text-[17px] text-ink-muted">
        {t('markLine')}
        <span className="mt-1 block text-[13px] font-sans">{t('markCite')}</span>
      </p>
    </main>
  );
}
