import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const KEY = 'ebenezer-downloads';

type DownloadsValue = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const DownloadsContext = createContext<DownloadsValue | null>(null);

export function DownloadsProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setIds(JSON.parse(raw) as string[]);
    });
  }, []);

  const value = useMemo<DownloadsValue>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle: (id) => {
        setIds((current) => {
          const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
          void AsyncStorage.setItem(KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [ids],
  );

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
}

export function useDownloads() {
  const value = useContext(DownloadsContext);
  if (!value) throw new Error('useDownloads outside provider');
  return value;
}
