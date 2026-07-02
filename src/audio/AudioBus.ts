/**
 * Global audio bus — a single shared player so only one clip plays at a time.
 * Mirrors the prototype's AudioBus (play/stop/subscribe + current id).
 */
import { useEffect, useState } from 'react';
import {
  AudioPlayer,
  AudioStatus,
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';

export type AudioSource = number; // a require()'d module id

type Listener = (current: string | null) => void;

let player: AudioPlayer | null = null;
const listeners = new Set<Listener>();
let current: string | null = null;

// Play even when the device is on silent (iOS) and mix politely with other apps.
try {
  setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
  }).catch(() => {});
} catch {
  // some platforms (web) may not implement audio modes
}

function notify() {
  listeners.forEach((l) => l(current));
}

function ensurePlayer(source: AudioSource): AudioPlayer {
  if (!player) {
    player = createAudioPlayer(source);
    player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (status.didJustFinish) {
        current = null;
        notify();
      }
    });
  }
  return player;
}

export const AudioBus = {
  play(source: AudioSource, id: string) {
    const p = ensurePlayer(source);
    try {
      p.replace(source); // reloads the clip at position 0 (also for repeats)
      p.play();
      current = id;
    } catch {
      current = null;
    }
    notify();
  },
  stop() {
    if (player) {
      try {
        player.pause();
      } catch {
        // ignore
      }
    }
    current = null;
    notify();
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  get current(): string | null {
    return current;
  },
};

/** Reflects whether the clip with `id` is the one currently playing. */
export function usePlaying(id: string | null): boolean {
  const [cur, setCur] = useState<string | null>(AudioBus.current);
  useEffect(() => AudioBus.subscribe(setCur), []);
  return id != null && cur === id;
}
