import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { Glyph } from '../components/Glyph';
import { PlayButton } from '../components/PlayButton';
import { ScopeToggle } from '../components/ScopeToggle';
import { Btn, EmptyState, Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import { Item, itemGlyph, itemKey, itemRoman } from '../data/khmer';
import { shuffle } from '../utils/helpers';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

export function MatchScreen({ navigation }: ScreenProps<'Match'>) {
  const { c, sh } = useTheme();
  const app = useApp();
  const pool = app.getPool(app.scope);
  const roundSize = Math.min(6, pool.length);

  const [round, setRound] = useState(0);
  const [left, setLeft] = useState<Item[]>([]);
  const [right, setRight] = useState<Item[]>([]);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ l: string; r: string } | null>(null);
  const [moves, setMoves] = useState(0);

  const newRound = useCallback(() => {
    const pick = shuffle(pool).slice(0, roundSize);
    setLeft(shuffle(pick));
    setRight(shuffle(pick));
    setMatched({});
    setSelLeft(null);
    setSelRight(null);
    setWrong(null);
    setMoves(0);
  }, [pool, roundSize]);

  useEffect(() => {
    newRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, app.scope, pool.length]);

  const tryMatch = useCallback((l: string, r: string) => {
    setMoves((m) => m + 1);
    if (l === r) {
      setMatched((mm) => ({ ...mm, [l]: true }));
      setSelLeft(null);
      setSelRight(null);
    } else {
      setWrong({ l, r });
      setTimeout(() => {
        setWrong(null);
        setSelLeft(null);
        setSelRight(null);
      }, 480);
    }
  }, []);

  function tapGlyph(k: string) {
    if (matched[k] || wrong) return;
    if (selRight) {
      tryMatch(k, selRight);
      return;
    }
    setSelLeft((s) => (s === k ? null : k));
  }
  function tapSound(item: Item) {
    const k = itemKey(item);
    if (matched[k] || wrong) return;
    const src = itemAudio(item, app.audioSet);
    if (src != null) AudioBus.play(src, 'm-' + k);
    if (selLeft) {
      tryMatch(selLeft, k);
      return;
    }
    setSelRight((s) => (s === k ? null : k));
  }

  const doneCount = Object.keys(matched).length;
  const allDone = doneCount === left.length && left.length > 0;
  const soundCol = left.length > 0 && itemAudio(left[0], app.audioSet) != null;

  if (pool.length < 2) {
    return (
      <Screen maxWidth={620}>
        <ScopeToggle />
        <EmptyState
          khmer="កៀក"
          title="Need a few more"
          message="Enable at least two characters in this scope to play a matching board."
          ctaTitle="Open Settings"
          onCta={() => navigation.navigate('Settings')}
        />
      </Screen>
    );
  }

  if (allDone) {
    return (
      <Screen maxWidth={620}>
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text style={{ fontSize: 54 }}>🎉</Text>
          <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 26, color: c.ink, marginTop: 6, marginBottom: 4 }}>
            Board cleared!
          </Text>
          <Text style={{ fontFamily: UI.regular, fontSize: 15, color: c.ink2, marginBottom: 20 }}>
            {left.length} pairs matched in {moves} move{moves === 1 ? '' : 's'}.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Btn title="New board" icon="shuffle" onPress={() => setRound((r) => r + 1)} />
            <Btn title="Home" icon="home" variant="soft" onPress={() => navigation.navigate('Home')} />
          </View>
        </View>
      </Screen>
    );
  }

  const cellStyle = (
    selected: boolean,
    isDone: boolean,
    isWrong: boolean,
  ) => ({
    borderRadius: 14,
    borderWidth: 1.5,
    aspectRatio: 2.1,
    borderColor: isWrong ? c.bad : isDone ? c.good : selected ? c.accent : c.line,
    borderStyle: (isDone ? 'dashed' : 'solid') as 'dashed' | 'solid',
    backgroundColor: isWrong ? c.badSoft : isDone ? c.goodSoft : selected ? c.accentSoft : c.surface,
    opacity: isDone ? 0.4 : 1,
  });

  return (
    <Screen maxWidth={620}>
      <ScopeToggle />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <View style={{ flex: 1, height: 9, borderRadius: 999, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, overflow: 'hidden' }}>
          <View style={{ height: '100%', borderRadius: 999, backgroundColor: c.accent, width: `${left.length ? (doneCount / left.length) * 100 : 0}%` }} />
        </View>
        <Text style={{ fontFamily: MONO.semibold, fontSize: 13, color: c.ink2 }}>
          {doneCount}/{left.length} · {moves} moves
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 13 }}>
        {/* Glyph column */}
        <View style={{ flex: 1, gap: 11 }}>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3, textAlign: 'center' }}>
            Glyph
          </Text>
          {left.map((item) => {
            const k = itemKey(item);
            const isWrong = !!wrong && wrong.l === k;
            return (
              <Pressable
                key={k}
                onPress={() => tapGlyph(k)}
                style={[cellStyle(selLeft === k, !!matched[k], isWrong), { alignItems: 'center', justifyContent: 'center' }, sh.sm]}
              >
                <Glyph size={38} scaled>
                  {itemGlyph(item)}
                </Glyph>
              </Pressable>
            );
          })}
        </View>

        {/* Sound / Reading column */}
        <View style={{ flex: 1, gap: 11 }}>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3, textAlign: 'center' }}>
            {soundCol ? 'Sound' : 'Reading'}
          </Text>
          {right.map((item) => {
            const k = itemKey(item);
            const audio = itemAudio(item, app.audioSet) != null;
            const isWrong = !!wrong && wrong.r === k;
            const done = !!matched[k];
            return (
              <Pressable
                key={k}
                onPress={() => tapSound(item)}
                style={[cellStyle(selRight === k, done, isWrong), { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14 }, sh.sm]}
              >
                {audio && <PlayButton item={item} size={36} ghost playId={'m-' + k} />}
                <Text style={{ fontFamily: MONO.semibold, fontSize: 15, color: done ? c.good : c.ink2 }}>
                  {audio ? (done ? itemRoman(item) : '♪') : itemRoman(item)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={{ textAlign: 'center', marginTop: 18, color: c.ink3, fontSize: 13, fontFamily: UI.regular }}>
        {soundCol
          ? 'Tap a glyph, then its sound — or tap a sound to hear it first.'
          : 'Tap a glyph, then its matching reading.'}
      </Text>
    </Screen>
  );
}
