'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/field';
import { trpc } from '@/lib/trpc';

export function SermonDraftForm() {
  const router = useRouter();
  const create = trpc.office.createSermon.useMutation();
  const [titleSw, setTitleSw] = useState('');
  const [preacher, setPreacher] = useState('Mchungaji Yohana Mwanga');
  const [readings, setReadings] = useState('Zaburi 121');
  const [preachedOn, setPreachedOn] = useState('2026-09-27');

  return (
    <form
      className="mt-8 grid gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await create.mutateAsync({ titleSw, preacher, readings, preachedOn });
        setTitleSw('');
        router.refresh();
      }}
    >
      <p className="font-serif text-[20px]">Rasimu ya hubiri</p>
      <Label htmlFor="title">Kichwa</Label>
      <Input id="title" value={titleSw} onChange={(event) => setTitleSw(event.target.value)} required />
      <Label htmlFor="preacher">Mhubiri</Label>
      <Input id="preacher" value={preacher} onChange={(event) => setPreacher(event.target.value)} required />
      <Label htmlFor="readings">Masomo</Label>
      <Input id="readings" value={readings} onChange={(event) => setReadings(event.target.value)} required />
      <Label htmlFor="date">Tarehe</Label>
      <Input id="date" type="date" value={preachedOn} onChange={(event) => setPreachedOn(event.target.value)} required />
      <Button type="submit" disabled={create.isPending}>
        Hifadhi rasimu
      </Button>
    </form>
  );
}

export function PublishButton({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const publish = trpc.office.publishSermon.useMutation();
  if (status === 'published') return <span className="text-[13px] text-success">Imechapishwa</span>;
  return (
    <Button
      type="button"
      variant="quiet"
      disabled={publish.isPending}
      onClick={async () => {
        await publish.mutateAsync({ id });
        router.refresh();
      }}
    >
      Chapisha
    </Button>
  );
}

export function LiveButtons({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const setLive = trpc.office.setLive.useMutation();
  return (
    <div className="flex gap-2">
      {(['scheduled', 'live', 'ended'] as const).map((next) => (
        <Button
          key={next}
          type="button"
          variant={status === next ? 'gold' : 'quiet'}
          disabled={setLive.isPending}
          onClick={async () => {
            await setLive.mutateAsync({ id, status: next });
            router.refresh();
          }}
        >
          {next === 'scheduled' ? 'Imepangwa' : next === 'live' ? 'Moja kwa moja' : 'Imeisha'}
        </Button>
      ))}
    </div>
  );
}

export function CashForm() {
  const router = useRouter();
  const cash = trpc.office.cashOffering.useMutation();
  const [amount, setAmount] = useState('10000');
  const [note, setNote] = useState('Sadaka ya ibada');

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await cash.mutateAsync({
          amountTzs: Number(amount.replace(/\D/g, '')),
          categoryKey: 'sadaka',
          note,
        });
        router.refresh();
      }}
    >
      <Label htmlFor="cash">Kiasi (TZS)</Label>
      <Input id="cash" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <Label htmlFor="note">Maelezo</Label>
      <Input id="note" value={note} onChange={(event) => setNote(event.target.value)} />
      <Button type="submit" disabled={cash.isPending}>
        Andika sadaka ya taslimu
      </Button>
    </form>
  );
}

export function AnnouncementForm() {
  const router = useRouter();
  const create = trpc.office.createAnnouncement.useMutation();
  const [titleSw, setTitle] = useState('');
  const [bodySw, setBody] = useState('');

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await create.mutateAsync({ titleSw, bodySw, channel: 'both' });
        setTitle('');
        setBody('');
        router.refresh();
      }}
    >
      <Label htmlFor="atitle">Kichwa</Label>
      <Input id="atitle" value={titleSw} onChange={(event) => setTitle(event.target.value)} required />
      <Label htmlFor="abody">Ujumbe</Label>
      <textarea
        id="abody"
        required
        value={bodySw}
        onChange={(event) => setBody(event.target.value)}
        className="min-h-28 rounded-[var(--radius-control)] border border-line bg-surface p-3"
      />
      <div className="rounded-[var(--radius-sheet)] border border-line bg-bg p-4">
        <p className="text-[13px] text-ink-muted">Muonekano wa simu</p>
        <p className="mt-2 font-serif text-[20px]">{titleSw || 'Kichwa cha tangazo'}</p>
        <p className="mt-2 text-ink-muted">{bodySw || 'Ujumbe utaonekana hapa.'}</p>
      </div>
      <Button type="submit" disabled={create.isPending}>
        Tuma tangazo
      </Button>
    </form>
  );
}
