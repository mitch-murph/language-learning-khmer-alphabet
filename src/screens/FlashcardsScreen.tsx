import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { PlayButton } from '../components/PlayButton';
import { RegPill } from '../components/RegPill';
import { ScopeToggle } from '../components/ScopeToggle';
import { Btn, Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import {
  Consonant,
  CONSONANTS,
  Item,
  itemGlyph,
  itemKey,
  itemRoman,
  REGISTER,
  SERIES,
  Vowel,
} from '../data/khmer';
import { shuffle } from '../utils/helpers';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

function BackRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View>
      <Text style={{ fontFamily: MONO.semibold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: c.ink3, marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: UI.regular, fontSize: 14, lineHeight: 21, color: c.ink }}>{children}</Text>
    </View>
  );
}

function CardBack({ item }: { item: Item }) {
  const { c } = useTheme();
  if (item.kind === 'vowel') {
    const v = item as Vowel;
    return (
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 28, color: c.ink }}>
            {v.aRead} · {v.oRead}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3 }}>{v.note}</Text>
        </View>
        <BackRow label="Two readings">
          A dependent vowel changes sound with its consonant’s series.
        </BackRow>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, alignItems: 'center', borderRadius: 10, paddingVertical: 9, backgroundColor: c.aregSoft }}>
            <Text style={{ fontFamily: MONO.semibold, fontSize: 18, color: c.aregInk }}>{v.aRead}</Text>
            <Text style={{ fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: c.aregInk, fontFamily: MONO.semibold }}>â-series</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderRadius: 10, paddingVertical: 9, backgroundColor: c.oregSoft }}>
            <Text style={{ fontFamily: MONO.semibold, fontSize: 18, color: c.oregInk }}>{v.oRead}</Text>
            <Text style={{ fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: c.oregInk, fontFamily: MONO.semibold }}>ô-series</Text>
          </View>
        </View>
        <BackRow label="On a consonant">{''}</BackRow>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, alignItems: 'center', backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingVertical: 8 }}>
            <Glyph size={26}>{'ក' + v.glyph}</Glyph>
            <Text style={{ fontFamily: MONO.regular, fontSize: 11, color: c.ink2 }}>k{v.aRead}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingVertical: 8 }}>
            <Glyph size={26}>{'គ' + v.glyph}</Glyph>
            <Text style={{ fontFamily: MONO.regular, fontSize: 11, color: c.ink2 }}>k{v.oRead}</Text>
          </View>
        </View>
      </View>
    );
  }
  const con = item as Consonant;
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 28, color: c.ink }}>{con.roman}</Text>
        <Text style={{ fontFamily: MONO.regular, fontSize: 14, color: c.ink2 }}>{con.ipa}</Text>
        <View style={{ flex: 1 }} />
        <RegPill register={con.register} />
      </View>
      <BackRow label="Series">
        {SERIES[con.series].label} · inherent vowel {REGISTER[con.register].vowel}
      </BackRow>
      <BackRow label="Sounds like">{con.pronounce}</BackRow>
      <BackRow label="Remember">{con.mnemonic}</BackRow>
      {con.words.length > 0 && (
        <View>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: c.ink3, marginBottom: 4 }}>
            In words
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {con.words.map((w, k) => (
              <View key={k} style={{ backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 9, paddingVertical: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Glyph size={17} style={{ marginRight: 5 }}>
                  {w.km}
                </Glyph>
                <Text style={{ fontFamily: UI.regular, fontSize: 12.5, color: c.ink }}>
                  {w.roman} · {w.en}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export function FlashcardsScreen(_props: ScreenProps<'Flashcards'>) {
  const { c, sh } = useTheme();
  const app = useApp();
  const pool = app.getPool(app.scope);
  const base: Item[] = pool.length ? pool : CONSONANTS;
  const [shuf, setShuf] = useState(false);
  const order = useMemo(() => (shuf ? shuffle(base) : base), [shuf, base]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setI(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.scope]);

  useEffect(() => {
    Animated.timing(flip, { toValue: flipped ? 1 : 0, duration: 500, useNativeDriver: true }).start();
  }, [flipped, flip]);

  const item = order[Math.min(i, order.length - 1)];
  const isVowel = item.kind === 'vowel';
  const favKey = itemKey(item);
  const hasAudio = itemAudio(item, app.audioSet) != null;

  const goTo = (ni: number) => {
    AudioBus.stop();
    setFlipped(false);
    setTimeout(() => setI((ni + order.length) % order.length), flipped ? 180 : 0);
  };

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const frontTint = isVowel ? c.surface2 : item.register === 'a' ? c.aregSoft : c.oregSoft;

  const faceBase = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: c.line,
    backfaceVisibility: 'hidden' as const,
    overflow: 'hidden' as const,
  };

  return (
    <Screen maxWidth={520}>
      <ScopeToggle />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <Text style={{ fontFamily: MONO.semibold, fontSize: 14, color: c.ink2 }}>
          {i + 1} / {order.length}
        </Text>
        <View style={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, overflow: 'hidden' }}>
          <View style={{ height: '100%', backgroundColor: c.accent, width: `${((i + 1) / order.length) * 100}%` }} />
        </View>
        <Pressable
          onPress={() => {
            setShuf((s) => !s);
            setI(0);
            setFlipped(false);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 7,
            paddingHorizontal: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: shuf ? c.accent : c.line,
            backgroundColor: shuf ? c.accentSoft : c.surface,
          }}
        >
          <Icon name="shuffle" size={14} color={shuf ? c.accentInk : c.ink2} />
          <Text style={{ fontFamily: UI.semibold, fontSize: 13, color: shuf ? c.accentInk : c.ink2 }}>Shuffle</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => setFlipped((f) => !f)} style={{ aspectRatio: 3 / 3.4 }}>
        {/* Front */}
        <Animated.View style={[faceBase, sh.md, { backgroundColor: frontTint, alignItems: 'center', justifyContent: 'center', gap: 14, transform: [{ perspective: 1600 }, { rotateY: frontRotate }] }]}>
          <Text style={{ position: 'absolute', top: 16, left: 16, fontFamily: MONO.semibold, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase', color: c.ink3 }}>
            {isVowel ? 'Vowel' : SERIES[item.series].label}
          </Text>
          <Glyph size={150}>{itemGlyph(item)}</Glyph>
          {hasAudio ? (
            <PlayButton item={item} size={48} playId={'fc-' + favKey} />
          ) : (
            <Text style={{ fontFamily: MONO.semibold, fontSize: 18, color: c.ink2 }}>{itemRoman(item)}</Text>
          )}
          <Text style={{ position: 'absolute', bottom: 18, fontFamily: MONO.regular, fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', color: c.ink3 }}>
            Tap to flip
          </Text>
        </Animated.View>
        {/* Back */}
        <Animated.View style={[faceBase, sh.md, { backgroundColor: c.surface, padding: 22, transform: [{ perspective: 1600 }, { rotateY: backRotate }] }]}>
          <CardBack item={item} />
        </Animated.View>
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 18, alignItems: 'center' }}>
        <Btn title="Prev" icon="back" variant="soft" flex={1} onPress={() => goTo(i - 1)} />
        <Btn title="Flip" icon="refresh" flex={1.4} onPress={() => setFlipped((f) => !f)} />
        <Btn title="Next" variant="soft" flex={1} onPress={() => goTo(i + 1)} />
      </View>
    </Screen>
  );
}
