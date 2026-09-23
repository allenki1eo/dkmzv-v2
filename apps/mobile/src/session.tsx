import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type MemberSession = {
  name: string;
  phone: string;
  locale: 'sw' | 'en';
  jumuiyaId: string | null;
  jumuiyaAsked: boolean;
  lowData: boolean;
};

type SessionValue = {
  ready: boolean;
  user: MemberSession | null;
  enterDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  update: (patch: Partial<MemberSession>) => Promise<void>;
};

const KEY = 'ebenezer-member';
const SessionContext = createContext<SessionValue | null>(null);

const demo: MemberSession = {
  name: 'Neema Mwanga',
  phone: '+255712000100',
  locale: 'sw',
  jumuiyaId: 'amani',
  jumuiyaAsked: false,
  lowData: false,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<MemberSession | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw) as MemberSession);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      ready,
      user,
      enterDemo: async () => {
        setUser(demo);
        await AsyncStorage.setItem(KEY, JSON.stringify(demo));
      },
      signOut: async () => {
        setUser(null);
        await AsyncStorage.removeItem(KEY);
      },
      update: async (patch) => {
        setUser((current) => {
          if (!current) return current;
          const next = { ...current, ...patch };
          void AsyncStorage.setItem(KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [ready, user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession outside provider');
  return value;
}
