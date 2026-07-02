/** Custom sticky top bar: brand on Home, back + breadcrumb elsewhere. */
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { VoiceToggle } from '../components/VoiceToggle';
import { byGlyph } from '../data/khmer';
import { DISPLAY, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList, TITLES } from './types';

function IconBtn({
  name,
  onPress,
  label,
}: {
  name: 'back' | 'moon' | 'sun' | 'gear';
  onPress: () => void;
  label: string;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? c.surface2 : 'transparent',
      })}
    >
      <Icon name={name} size={name === 'gear' ? 21 : name === 'back' ? 22 : 20} color={c.ink2} />
    </Pressable>
  );
}

export function TopBar({ navigation, route }: NativeStackHeaderProps) {
  const { c, dark, setDark } = useTheme();
  const insets = useSafeAreaInsets();
  const name = route.name as keyof RootStackParamList;
  const onHome = name === 'Home';

  let crumb: React.ReactNode = null;
  if (!onHome) {
    if (name === 'Detail') {
      const glyph = (route.params as { glyph: string } | undefined)?.glyph ?? '';
      const con = byGlyph(glyph);
      crumb = (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: DISPLAY.bold, fontSize: 15, color: c.ink }}>
            {con?.roman ?? ''}
          </Text>
          <Glyph size={16} color={c.ink3}>
            {glyph}
          </Glyph>
        </View>
      );
    } else {
      crumb = (
        <Text style={{ fontFamily: DISPLAY.bold, fontSize: 15, color: c.ink }}>
          {TITLES[name] ?? ''}
        </Text>
      );
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 14,
        paddingTop: Math.max(14, insets.top),
        backgroundColor: c.bg,
        borderBottomWidth: 1,
        borderBottomColor: c.line,
      }}
    >
      {onHome ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: c.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Glyph size={20} color="#fff" weight="NotoSerifKhmer_400Regular">
              ក
            </Glyph>
          </View>
          <Text style={{ fontFamily: DISPLAY.bold, fontSize: 19, color: c.ink, letterSpacing: -0.4 }}>
            Aksar
          </Text>
        </View>
      ) : (
        <IconBtn name="back" label="Back" onPress={() => navigation.goBack()} />
      )}

      {!onHome && crumb}

      <View style={{ flex: 1 }} />

      <VoiceToggle compact />
      <IconBtn
        name={dark ? 'sun' : 'moon'}
        label="Toggle dark mode"
        onPress={() => setDark(!dark)}
      />
      {onHome && (
        <IconBtn name="gear" label="Settings" onPress={() => navigation.navigate('Settings')} />
      )}
    </View>
  );
}
