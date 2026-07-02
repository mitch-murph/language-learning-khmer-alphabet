/** Audio-set segmented control (Voice A / Voice B). */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { useApp } from '../context/AppContext';
import { UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';

export function VoiceToggle({ compact }: { compact?: boolean }) {
  const app = useApp();
  const { c, sh } = useTheme();

  const opt = (set: 1 | 2, label: string) => {
    const on = app.audioSet === set;
    return (
      <Pressable
        key={set}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={() => {
          AudioBus.stop();
          app.setAudioSet(set);
        }}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingVertical: 7,
            paddingHorizontal: 12,
            borderRadius: 999,
          },
          on && { backgroundColor: c.surface, ...sh.sm },
        ]}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: on ? c.accent : c.ink2,
            opacity: on ? 1 : 0.5,
          }}
        />
        <Text style={{ fontFamily: UI.semibold, fontSize: 12.5, color: on ? c.ink : c.ink2 }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: c.surface2,
        borderWidth: 1,
        borderColor: c.line,
        borderRadius: 999,
        padding: 3,
        gap: 2,
      }}
    >
      {opt(1, compact ? 'A' : 'Voice A')}
      {opt(2, compact ? 'B' : 'Voice B')}
    </View>
  );
}
