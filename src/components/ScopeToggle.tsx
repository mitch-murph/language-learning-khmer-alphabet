/** Practice scope toggle (Consonants / Vowels / Mixed), each with a sample glyph. */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { Scope, useApp } from '../context/AppContext';
import { UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { Glyph } from './Glyph';

const OPTS: { k: Scope; label: string; g: string }[] = [
  { k: 'consonants', label: 'Consonants', g: 'ក' },
  { k: 'vowels', label: 'Vowels', g: 'កា' },
  { k: 'mixed', label: 'Mixed', g: 'កី' },
];

export function ScopeToggle() {
  const app = useApp();
  const { c, sh } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: c.surface2,
          borderWidth: 1,
          borderColor: c.line,
          borderRadius: 999,
          padding: 3,
          gap: 2,
        }}
      >
        {OPTS.map((o) => {
          const on = app.scope === o.k;
          return (
            <Pressable
              key={o.k}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => {
                AudioBus.stop();
                app.setScope(o.k);
              }}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 9,
                  paddingHorizontal: 15,
                  borderRadius: 999,
                },
                on && { backgroundColor: c.surface, ...sh.sm },
              ]}
            >
              <Glyph size={16} color={on ? c.accent : c.ink2}>
                {o.g}
              </Glyph>
              <Text style={{ fontFamily: UI.semibold, fontSize: 13, color: on ? c.ink : c.ink2 }}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
