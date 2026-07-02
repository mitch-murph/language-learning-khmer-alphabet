/**
 * Round play/pause button wired to the AudioBus. Reflects playing state and
 * disables (dimmed) when the item has no audio (e.g. vowels for now).
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { AudioBus, usePlaying } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { useApp } from '../context/AppContext';
import { Item } from '../data/khmer';
import { useTheme } from '../theme/ThemeContext';
import { Icon } from './Icon';

interface PlayButtonProps {
  item: Item;
  set?: 1 | 2;
  size?: number;
  ghost?: boolean;
  playId?: string;
}

export function PlayButton({ item, set, size = 44, ghost, playId }: PlayButtonProps) {
  const app = useApp();
  const { c, sh } = useTheme();
  const activeSet = set ?? app.audioSet;
  const src = itemAudio(item, activeSet);
  const id = playId ?? (src != null ? 'src-' + src : 'noaudio');
  const playing = usePlaying(id);
  const has = src != null;

  function onPress() {
    if (!has || src == null) return;
    if (playing) {
      AudioBus.stop();
      return;
    }
    AudioBus.play(src, id);
  }

  const iconColor = ghost ? c.accent : '#fff';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Play sound"
      onPress={onPress}
      disabled={!has}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ghost ? c.surface : c.accent,
          borderWidth: ghost ? 1.5 : 0,
          borderColor: c.accent,
          opacity: has ? 1 : 0.4,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
        sh.sm,
      ]}
    >
      {/* subtle ring while playing */}
      {playing && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -5,
            left: -5,
            right: -5,
            bottom: -5,
            borderRadius: (size + 10) / 2,
            borderWidth: 2,
            borderColor: c.accent,
            opacity: 0.5,
          }}
        />
      )}
      <Icon name={playing ? 'pause' : 'play'} size={Math.round(size * 0.46)} color={iconColor} />
    </Pressable>
  );
}
