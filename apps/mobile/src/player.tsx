import type { ParishSermon } from '@ebenezer/shared';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { createContext, useContext, useState, type ReactNode } from 'react';

type PlayerValue = {
  sermon: ParishSermon | null;
  playing: boolean;
  speed: number;
  position: number;
  duration: number;
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
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = async (next: ParishSermon) => {
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
      isLooping: false,
      progressUpdateIntervalMillis: 400,
    });
    sound = created.sound;
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);
    });
    setSermon(next);
    setPlaying(true);
  };

  const toggle = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
  };

  const cycleSpeed = async () => {
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length] ?? 1;
    setSpeed(next);
    if (sound) await sound.setRateAsync(next, true);
  };

  return (
    <PlayerContext.Provider value={{ sermon, playing, speed, position, duration, play, toggle, cycleSpeed }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error('usePlayer outside provider');
  return value;
}

export function clock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
