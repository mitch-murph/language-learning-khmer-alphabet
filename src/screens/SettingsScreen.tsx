import React, { useCallback } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { Slider } from '../components/Slider';
import { Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import { CONSONANTS, SERIES, SERIES_ORDER, VOWELS } from '../data/khmer';
import { GLYPH_FONT_OPTIONS } from '../theme/fonts';
import { ACCENT_OPTIONS, GLYPH_SCALE_MAX, GLYPH_SCALE_MIN } from '../theme/tokens';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 26, marginBottom: 14, paddingBottom: 9, borderBottomWidth: 1.5, borderBottomColor: c.line }}>
      <Text style={{ fontFamily: MONO.semibold, fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: c.ink3 }}>
        {children}
      </Text>
      <View style={{ flex: 1 }} />
      {right}
    </View>
  );
}

export function SettingsScreen(_props: ScreenProps<'Settings'>) {
  const { c, sh, dark, setDark, accent, setAccent, glyphFont, setGlyphFont, glyphScale, setGlyphScale } = useTheme();
  const app = useApp();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width - 40, 760);
  const cols = Math.max(2, Math.floor((contentW + 9) / (110 + 9)));
  const chipW = (contentW - 9 * (cols - 1)) / cols;

  const enabled = app.enabled;
  const enabledV = app.enabledVowels;
  const isOn = (g: string) => enabled.indexOf(g) >= 0;
  const isVOn = (id: string) => enabledV.indexOf(id) >= 0;

  const toggle = useCallback(
    (g: string) => app.setEnabled((e) => (e.indexOf(g) >= 0 ? e.filter((x) => x !== g) : [...e, g])),
    [app],
  );
  const setMany = useCallback(
    (glyphs: string[], on: boolean) =>
      app.setEnabled((e) => {
        const s = new Set(e);
        glyphs.forEach((g) => (on ? s.add(g) : s.delete(g)));
        return Array.from(s);
      }),
    [app],
  );
  const toggleV = useCallback(
    (id: string) => app.setEnabledVowels((e) => (e.indexOf(id) >= 0 ? e.filter((x) => x !== id) : [...e, id])),
    [app],
  );
  const setManyV = useCallback(
    (ids: string[], on: boolean) =>
      app.setEnabledVowels((e) => {
        const s = new Set(e);
        ids.forEach((id) => (on ? s.add(id) : s.delete(id)));
        return Array.from(s);
      }),
    [app],
  );

  const allVowelsOn = enabledV.length === VOWELS.length;

  const Chip = ({ glyph, roman, on, onPress }: { glyph: string; roman: string; on: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{
        width: chipW,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        paddingVertical: 9,
        paddingHorizontal: 11,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: on ? c.accent : c.line,
        backgroundColor: c.surface,
        opacity: on ? 1 : 0.5,
      }}
    >
      <Glyph size={24} style={{ minWidth: 26 }}>
        {glyph}
      </Glyph>
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: MONO.semibold, fontSize: 12.5, color: c.ink }}>
        {roman}
      </Text>
      <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: on ? c.accent : c.line2, backgroundColor: on ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {on && <Icon name="check" size={13} sw={3} color="#fff" />}
      </View>
    </Pressable>
  );

  const preset = (label: string, onPress: () => void) => (
    <Pressable onPress={onPress} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
      <Text style={{ fontFamily: UI.semibold, fontSize: 13, color: c.ink }}>{label}</Text>
    </Pressable>
  );

  const groupToggle = (label: string, onPress: () => void) => (
    <Pressable onPress={onPress} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}>
      <Text style={{ fontFamily: UI.semibold, fontSize: 12.5, color: c.ink2 }}>{label}</Text>
    </Pressable>
  );

  return (
    <Screen maxWidth={760}>
      {/* Hero */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: 18, borderRadius: 20, backgroundColor: c.accentSoft, borderWidth: 1, borderColor: c.accent }}>
        <View style={{ flexDirection: 'row', gap: 22 }}>
          <View>
            <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 32, color: c.accentInk, letterSpacing: -0.6 }}>{enabled.length}</Text>
            <Text style={{ fontFamily: UI.semibold, fontSize: 14, color: c.ink3, marginTop: 4 }}>letters</Text>
          </View>
          <View>
            <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 32, color: c.accentInk, letterSpacing: -0.6 }}>{enabledV.length}</Text>
            <Text style={{ fontFamily: UI.semibold, fontSize: 14, color: c.ink3, marginTop: 4 }}>vowels</Text>
          </View>
        </View>
        <Text style={{ flex: 1, minWidth: 180, fontFamily: UI.regular, fontSize: 13.5, color: c.ink2, lineHeight: 20 }}>
          Every quiz, flashcard and matching board draws from what’s enabled here — and the scope
          toggle in each drill.
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {preset('All', () => {
            app.setEnabled(CONSONANTS.map((con) => con.glyph));
            app.setEnabledVowels(VOWELS.map((v) => v.id));
          })}
          {preset('None', () => {
            app.setEnabled([]);
            app.setEnabledVowels([]);
          })}
        </View>
      </View>

      {/* Appearance */}
      <SectionTitle>Appearance</SectionTitle>
      <View style={[{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 18, gap: 18 }, sh.sm]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontFamily: UI.semibold, fontSize: 15, color: c.ink }}>Dark mode</Text>
          <Pressable
            onPress={() => setDark(!dark)}
            style={{ width: 52, height: 30, borderRadius: 999, padding: 3, backgroundColor: dark ? c.accent : c.surface2, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.surface, alignSelf: dark ? 'flex-end' : 'flex-start', ...sh.sm }} />
          </Pressable>
        </View>

        <View>
          <Text style={{ fontFamily: UI.semibold, fontSize: 15, color: c.ink, marginBottom: 10 }}>Accent</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {ACCENT_OPTIONS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setAccent(a)}
                style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: a, alignItems: 'center', justifyContent: 'center', borderWidth: accent === a ? 3 : 0, borderColor: c.surface, ...(accent === a ? sh.sm : {}) }}
              >
                {accent === a && <Icon name="check" size={16} sw={3} color="#fff" />}
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: UI.semibold, fontSize: 15, color: c.ink, marginBottom: 10 }}>Khmer glyph font</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {GLYPH_FONT_OPTIONS.map((f) => {
              const on = glyphFont === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setGlyphFont(f)}
                  style={{ paddingVertical: 8, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accentSoft : c.surface }}
                >
                  <Text style={{ fontFamily: UI.semibold, fontSize: 13, color: on ? c.accentInk : c.ink2 }}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: UI.semibold, fontSize: 15, color: c.ink, marginBottom: 6 }}>
            Glyph size — {glyphScale.toFixed(2)}×
          </Text>
          <Slider min={GLYPH_SCALE_MIN} max={GLYPH_SCALE_MAX} step={0.05} value={glyphScale} onChange={setGlyphScale} />
        </View>
      </View>

      {/* Consonants */}
      <SectionTitle right={<Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3 }}>{enabled.length}/33</Text>}>
        Consonants
      </SectionTitle>
      {SERIES_ORDER.map((sk) => {
        const s = SERIES[sk];
        const items = CONSONANTS.filter((con) => con.series === sk);
        const onCount = items.filter((con) => isOn(con.glyph)).length;
        const allOn = onCount === items.length;
        return (
          <View key={sk} style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 2, marginBottom: 11 }}>
              <Text style={{ fontFamily: DISPLAY.bold, fontSize: 16, color: c.ink }}>{s.label}</Text>
              <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3 }}>{onCount}/{items.length}</Text>
              <View style={{ flex: 1 }} />
              {groupToggle(allOn ? 'Disable all' : 'Enable all', () => setMany(items.map((con) => con.glyph), !allOn))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
              {items.map((con) => (
                <Chip key={con.glyph} glyph={con.glyph} roman={con.roman} on={isOn(con.glyph)} onPress={() => toggle(con.glyph)} />
              ))}
            </View>
          </View>
        );
      })}

      {/* Vowels */}
      <SectionTitle
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3 }}>{enabledV.length}/{VOWELS.length}</Text>
            {groupToggle(allVowelsOn ? 'Disable all' : 'Enable all', () => setManyV(VOWELS.map((v) => v.id), !allVowelsOn))}
          </View>
        }
      >
        Vowels
      </SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
        {VOWELS.map((v) => (
          <Chip key={v.id} glyph={v.base} roman={`${v.aRead} · ${v.oRead}`} on={isVOn(v.id)} onPress={() => toggleV(v.id)} />
        ))}
      </View>
    </Screen>
  );
}
