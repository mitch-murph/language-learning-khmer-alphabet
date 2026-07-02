import React, { useMemo } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Glyph } from '../components/Glyph';
import { Icon, IconName } from '../components/Icon';
import { PlayButton } from '../components/PlayButton';
import { RegPill } from '../components/RegPill';
import { VoiceToggle } from '../components/VoiceToggle';
import { Btn, Screen } from '../components/ui';
import { byGlyph, CONSONANTS, REGISTER, SERIES } from '../data/khmer';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

function Block({
  icon,
  title,
  children,
  tint,
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
  tint?: 'accent';
}) {
  const { c, sh } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tint === 'accent' ? c.accentSoft : c.surface,
          borderWidth: 1,
          borderColor: tint === 'accent' ? c.accent : c.line,
          borderRadius: 20,
          padding: 18,
        },
        sh.sm,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon name={icon} size={15} color={c.accent} />
        <Text style={{ fontFamily: MONO.semibold, fontSize: 11.5, letterSpacing: 1.5, textTransform: 'uppercase', color: c.ink3 }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export function DetailScreen({ route, navigation }: ScreenProps<'Detail'>) {
  const { c, sh } = useTheme();
  const { width } = useWindowDimensions();
  const stack = width <= 720;

  const con = byGlyph(route.params.glyph) ?? CONSONANTS[0];
  const reg = REGISTER[con.register];
  const series = SERIES[con.series];
  const idx = con.idx;
  const prev = idx > 1 ? CONSONANTS[idx - 2] : null;
  const next = idx < 33 ? CONSONANTS[idx] : null;
  const regSoft = con.register === 'a' ? c.aregSoft : c.oregSoft;
  const regColor = con.register === 'a' ? c.areg : c.oreg;

  const confChars = useMemo(
    () => (con.confusables || []).map(byGlyph).filter(Boolean),
    [con.glyph],
  );

  const goGlyph = (g: string) => navigation.setParams({ glyph: g });

  const navPill = (dir: 'prev' | 'next') => {
    const target = dir === 'prev' ? prev : next;
    return (
      <Pressable
        disabled={!target}
        onPress={() => target && goGlyph(target.glyph)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          paddingVertical: 7,
          paddingHorizontal: 12,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.line,
          backgroundColor: c.surface,
          opacity: target ? 1 : 0.4,
        }}
      >
        {dir === 'prev' && <Icon name="back" size={16} color={c.ink2} />}
        {target ? (
          <Glyph size={16} color={c.ink2}>
            {target.glyph}
          </Glyph>
        ) : (
          <Text style={{ fontFamily: UI.semibold, fontSize: 13.5, color: c.ink2 }}>
            {dir === 'prev' ? 'Start' : 'End'}
          </Text>
        )}
        {dir === 'next' && <Icon name="next" size={16} color={c.ink2} />}
      </Pressable>
    );
  };

  const hero = (
    <View
      style={[
        {
          borderRadius: 28,
          padding: 26,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: c.line,
          backgroundColor: regSoft,
          width: stack ? '100%' : 300,
        },
        sh.sm,
      ]}
    >
      <Text style={{ fontFamily: MONO.regular, fontSize: 12, letterSpacing: 1.4, color: c.ink3 }}>
        {con.pad} / 33
      </Text>
      <Glyph size={stack ? 130 : 150} style={{ marginVertical: 4 }}>
        {con.glyph}
      </Glyph>
      <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 34, letterSpacing: -0.7, color: c.ink, marginTop: 6 }}>
        {con.roman}
      </Text>
      <Text style={{ fontFamily: MONO.regular, fontSize: 15, color: c.ink2, marginTop: 2 }}>{con.ipa}</Text>
      <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
        <RegPill register={con.register} />
        <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }}>
          <Text style={{ fontFamily: UI.semibold, fontSize: 12, color: c.ink2 }}>{series.label}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <PlayButton item={con} size={56} playId={'det-' + con.glyph} />
        <VoiceToggle compact />
      </View>
    </View>
  );

  const info = (
    <View style={{ flex: 1, gap: 14 }}>
      <Block icon="ear" title="How it sounds">
        <Text style={{ fontFamily: UI.regular, fontSize: 15.5, lineHeight: 24, color: c.ink }}>{con.pronounce}</Text>
      </Block>

      <Block icon="bolt" title="How to remember" tint="accent">
        <Text style={{ fontFamily: UI.regular, fontSize: 16, lineHeight: 24, color: c.accentInk }}>{con.mnemonic}</Text>
      </Block>

      <Block icon="target" title="Series & inherent vowel">
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: regColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: UI.bold, fontSize: 13, color: '#fff' }}>{reg.vowel}</Text>
          </View>
          <Text style={{ flex: 1, fontFamily: UI.regular, fontSize: 14, lineHeight: 21, color: c.ink2 }}>
            This is an <Text style={{ color: c.ink, fontFamily: UI.semibold }}>{reg.label}</Text> consonant ({reg.sub}). On its own it’s read{' '}
            <Text style={{ fontFamily: UI.semibold, color: c.ink }}>{con.roman}</Text>, carrying the inherent vowel{' '}
            <Text style={{ fontFamily: UI.semibold, color: c.ink }}>{reg.vowel}</Text> {reg.ipa}. {reg.blurb}
          </Text>
        </View>
      </Block>

      <Block icon="grid" title="In words">
        {con.words.length > 0 ? (
          <View style={{ gap: 8 }}>
            {con.words.map((w, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 11,
                  paddingHorizontal: 13,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.line,
                }}
              >
                <Glyph size={30} style={{ minWidth: 44 }}>
                  {w.km}
                </Glyph>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: MONO.semibold, fontSize: 14, color: c.ink }}>{w.roman}</Text>
                  <Text style={{ fontFamily: UI.regular, fontSize: 13, color: c.ink2, marginTop: 1 }}>{w.en}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontFamily: UI.regular, fontSize: 14, color: c.ink2, lineHeight: 21 }}>
            This character is rare in everyday Khmer — it appears mostly in older Pali / Sanskrit
            loanwords.
          </Text>
        )}
      </Block>

      {confChars.length > 0 && (
        <Block icon="link" title="Easily confused with">
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            {confChars.map((cc) => (
              <Pressable
                key={cc!.glyph}
                onPress={() => goGlyph(cc!.glyph)}
                style={{
                  alignItems: 'center',
                  gap: 3,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.line,
                }}
              >
                <Glyph size={30}>{cc!.glyph}</Glyph>
                <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink2 }}>{cc!.roman}</Text>
              </Pressable>
            ))}
          </View>
        </Block>
      )}

      <Block icon="pencil" title="Practice">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ flex: 1, fontFamily: UI.regular, fontSize: 14, color: c.ink2 }}>
            Try writing <Glyph size={20}>{con.glyph}</Glyph> from memory in the handwriting drill.
          </Text>
          <Btn title="Open" icon="pencil" variant="soft" onPress={() => navigation.navigate('Handwriting')} />
        </View>
      </Block>
    </View>
  );

  return (
    <Screen maxWidth={920}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        {navPill('prev')}
        <View style={{ flex: 1 }} />
        {navPill('next')}
      </View>
      {stack ? (
        <View style={{ gap: 22 }}>
          {hero}
          {info}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 22, alignItems: 'flex-start' }}>
          {hero}
          {info}
        </View>
      )}
    </Screen>
  );
}
