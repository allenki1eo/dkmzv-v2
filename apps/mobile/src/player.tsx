import { Audio, type AVPlaybackStatus } from 'expo-av';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ParishSermon } from '@ebenezer/shared';

type PlayerValue = {
  sermon: ParishSermon | null;
  playing: boolean;
  speed: number;
  play: (sermon: ParishSermon) => Promise<void>;
  toggle: () => Promise<void>;
  cycleSpeed: () => Promise<void>;
};

const PlayerContext = createContext<PlayerValue | null>(null);
const speeds = [0.75, 1, 1.25, 1.5, 2];

let sound: Audio.Sound | null = null;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [sermon, setSermon] = useState<ParishSermon | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const value = useMemo<PlayerValue>(
    () => ({
      sermon,
      playing,
      speed,
      play: async (next) => {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
        if (sound) {
          await sound.unloadAsync();
          sound = null;
        }
        const created = await Audio.Sound.createAsync(require('../assets/hubiri.wav'), {
          shouldPlay: true,
          rate: speed,
          shouldCorrectPitch: true,
        });
        sound = created.sound;
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          setPlaying(status.isPlaying);
        });
        setSermon(next);
        setPlaying(true);
      },
      toggle: async () => {
        if (!sound) return;
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;
        if (status.isPlaying) await sound.pauseAsync();
        else await sound.playAsync();
      },
      cycleSpeed: async () => {
        const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length] ?? 1;
        setSpeed(next);
        if (sound) await sound.setRateAsync(next, true);
      },
    }),
    [playing, sermon, speed],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error('usePlayer outside provider');
  return value;
}
