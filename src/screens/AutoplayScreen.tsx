import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { ScopeToggle } from '../components/ScopeToggle';
import { Slider } from '../components/Slider';
import { Wave } from '../components/Wave';
import { EmptyState, Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import { usePersistedState } from '../hooks/usePersistedState';
import { Item, itemGlyph, itemKey, itemRoman, SERIES } from '../data/khmer';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

const PAUSE_MIN = 0;
const PAUSE_MAX = 8.0;
const REPEAT_GAP = 900; // ms between repeated plays of the same audio, independent of the pause
const CHAR_PLAY_DELAY = 500; // ms to let the glyph register before its sound plays

export function AutoplayScreen({ navigation }: ScreenProps<'Autoplay'>) {
  const { c, sh } = useTheme();
  const app = useApp();
  const pool = app.getPool(app.scope);

  const [order, setOrder] = usePersistedState<'char' | 'sound'>('km_auto_order', 'char');
  const [pause, setPause] = usePersistedState('km_auto_pause', 3.0);
  const [repeat, setRepeat] = usePersistedState<1 | 2 | 3>('km_auto_repeat', 1);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(order === 'char');

  const deckRef = useRef<Item[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const wait = (ms: number) => new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    timers.current.push(t);
  });
  // bumped whenever the in-flight scheduler chain must be abandoned (pause/skip/scope change)
  const genRef = useRef(0);

  // (re)build deck when pool/scope changes; stop playback
  useEffect(() => {
    deckRef.current = pool.slice(); // canonical order — no shuffle
    genRef.current++;
    setIdx(0);
    setPlaying(false);
    setRevealed(order === 'char');
    clearTimers();
    AudioBus.stop();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.scope, pool.length]);

  const current = deckRef.current.length ? deckRef.current[idx % deckRef.current.length] : null;

  const advance = useCallback(() => setIdx((i) => i + 1), []);

  // main scheduler — waits for each clip to actually finish before the pause (and next clip) begins
  useEffect(() => {
    clearTimers();
    if (!playing || !current) return;
    const myGen = genRef.current;
    const stale = () => genRef.current !== myGen;
    const src = itemAudio(current, app.audioSet);
    const reps = src != null ? repeat : 1;

    async function run() {
      if (order === 'char') {
        setRevealed(true);
        await wait(CHAR_PLAY_DELAY);
        if (stale()) return;
      } else {
        setRevealed(false);
      }

      for (let k = 0; k < reps; k++) {
        if (src != null) {
          await AudioBus.playAndWait(src, 'auto');
        } else {
          await wait(REPEAT_GAP);
        }
        if (stale()) return;
        if (k < reps - 1) {
          await wait(REPEAT_GAP);
          if (stale()) return;
        }
      }

      const pauseMs = pause * 1000;
      if (order === 'sound') {
        // stay hidden for the first half (time to guess), reveal for the second half (confirmation)
        await wait(pauseMs / 2);
        if (stale()) return;
        setRevealed(true);
        await wait(pauseMs / 2);
      } else {
        await wait(pauseMs);
      }
      if (stale()) return;
      advance();
    }

    run();
    return () => {
      genRef.current++;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, order, pause, repeat, app.audioSet, current && itemKey(current)]);

  useEffect(() => () => {
    clearTimers();
    AudioBus.stop();
  }, []);

  function togglePlay() {
    if (playing) {
      genRef.current++;
      setPlaying(false);
      clearTimers();
      AudioBus.stop();
    } else {
      if (order === 'char') setRevealed(true);
      setPlaying(true);
    }
  }
  function skip() {
    genRef.current++;
    clearTimers();
    AudioBus.stop();
    setRevealed(order === 'char');
    advance();
  }
  function replay() {
    const src = current ? itemAudio(current, app.audioSet) : null;
    if (src != null) AudioBus.play(src, 'auto');
    setRevealed(true);
  }

  if (pool.length < 1) {
    return (
      <Screen maxWidth={680}>
        <ScopeToggle />
        <EmptyState
          khmer="ស្ងាត់"
          title="Nothing enabled"
          message="Turn on some characters in this scope to start hands-free playback."
          ctaTitle="Open Settings"
          onCta={() => navigation.navigate('Settings')}
        />
      </Screen>
    );
  }

  const isVowel = current?.kind === 'vowel';
  const cardTint = isVowel ? c.surface2 : current ? (current.register === 'a' ? c.aregSoft : c.oregSoft) : c.surface;
  const hasAudio = current ? itemAudio(current, app.audioSet) != null : false;
  const showGlyph = revealed || !playing;

  const pauseLabel = pause <= 1.6 ? 'Rapid' : pause <= 3 ? 'Brisk' : pause <= 5 ? 'Steady' : 'Relaxed';

  const orderBtn = (val: 'char' | 'sound', icon: 'grid' | 'ear', label: string) => {
    const on = order === val;
    return (
      <Pressable
        onPress={() => {
          setOrder(val);
          setRevealed(val === 'char');
        }}
        style={[
          { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 999 },
          on && { backgroundColor: c.surface, ...sh.sm },
        ]}
      >
        <Icon name={icon} size={15} color={on ? c.accent : c.ink2} />
        <Text style={{ fontFamily: UI.semibold, fontSize: 13, color: on ? c.ink : c.ink2 }}>{label}</Text>
      </Pressable>
    );
  };

  const ctrl = (icon: 'refresh' | 'next', onPress: () => void, label: string) => (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.line, transform: [{ scale: pressed ? 0.92 : 1 }] },
        sh.sm,
      ]}
    >
      <Icon name={icon} size={icon === 'refresh' ? 22 : 24} color={c.ink2} />
    </Pressable>
  );

  return (
    <Screen maxWidth={680}>
      <ScopeToggle />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 999, padding: 3, gap: 2 }}>
          {orderBtn('char', 'grid', 'Character first')}
          {orderBtn('sound', 'ear', 'Sound first')}
        </View>
      </View>

      {/* Stage */}
      <View style={{ alignItems: 'center', gap: 20, paddingVertical: 16 }}>
        <View style={[{ width: '86%', maxWidth: 420, aspectRatio: 1, borderRadius: 28, borderWidth: 1.5, borderColor: c.line, backgroundColor: cardTint, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, sh.md]}>
          {showGlyph ? (
            <Glyph size={200}>{current ? itemGlyph(current) : ''}</Glyph>
          ) : hasAudio ? (
            <View style={{ alignItems: 'center', gap: 14 }}>
              <Wave color={c.accent} bars={6} maxHeight={42} minHeight={14} barWidth={6} />
              <Text style={{ fontFamily: MONO.semibold, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: c.ink3 }}>Listen…</Text>
            </View>
          ) : (
            <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 120, color: c.ink3, opacity: 0.35 }}>?</Text>
          )}
        </View>
        <View style={{ minHeight: 56, alignItems: 'center', gap: 4 }}>
          <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 30, letterSpacing: -0.6, color: c.ink, opacity: showGlyph ? 1 : 0 }}>
            {current ? itemRoman(current) : ''}
          </Text>
          <Text style={{ fontFamily: MONO.regular, fontSize: 13, color: c.ink2, opacity: showGlyph ? 1 : 0 }}>
            {current && (isVowel ? 'dependent vowel · ' + current.note : current.ipa + ' · ' + SERIES[current.series].label)}
          </Text>
        </View>
      </View>

      {/* Transport */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {ctrl('refresh', replay, 'Replay this one')}
        <Pressable
          accessibilityLabel={playing ? 'Pause' : 'Play'}
          onPress={togglePlay}
          style={({ pressed }) => [
            { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: c.accent, transform: [{ scale: pressed ? 0.92 : 1 }] },
            sh.md,
          ]}
        >
          <Icon name={playing ? 'pause' : 'play'} size={playing ? 34 : 38} color="#fff" />
        </Pressable>
        {ctrl('next', skip, 'Skip to next')}
      </View>

      {/* Settings */}
      <View style={[{ marginTop: 26, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 18 }, sh.sm]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: c.line }}>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 11.5, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3 }}>Repeat each</Text>
          <View style={{ flexDirection: 'row', backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 999, padding: 3, gap: 2 }}>
            {([1, 2, 3] as const).map((n) => {
              const on = repeat === n;
              return (
                <Pressable key={n} onPress={() => setRepeat(n)} style={[{ minWidth: 46, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 }, on && { backgroundColor: c.accent, ...sh.sm }]}>
                  <Text style={{ fontFamily: MONO.semibold, fontSize: 14, color: on ? '#fff' : c.ink2 }}>{n}×</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 11.5, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3 }}>
            Pause between characters — {pause.toFixed(1)}s
          </Text>
          <Text style={{ fontFamily: DISPLAY.bold, fontSize: 16, color: c.accentInk }}>{pauseLabel}</Text>
        </View>
        <Slider min={PAUSE_MIN} max={PAUSE_MAX} step={0.2} value={pause} onChange={setPause} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
          <Text style={{ fontFamily: MONO.regular, fontSize: 11, color: c.ink3 }}>Fast</Text>
          <Text style={{ fontFamily: MONO.regular, fontSize: 11, color: c.ink3 }}>Slow</Text>
        </View>
      </View>

      <Text style={{ textAlign: 'center', marginTop: 14, fontFamily: MONO.regular, fontSize: 12, color: c.ink3, lineHeight: 18 }}>
        {order === 'char' ? 'Shows the character, then plays its sound' : 'Plays the sound first, then reveals the character'}
        {repeat > 1 ? ' — repeated ' + repeat + '×' : ''}. Plays in alphabet order, hands-free.
      </Text>
    </Screen>
  );
}
