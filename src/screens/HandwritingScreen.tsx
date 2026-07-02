import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AudioBus } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { DrawCanvas, DrawCanvasHandle } from '../components/DrawCanvas';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { PlayButton } from '../components/PlayButton';
import { ScopeToggle } from '../components/ScopeToggle';
import { Btn, EmptyState, Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import { Item, itemGlyph, itemKey, itemRoman, SERIES } from '../data/khmer';
import { shuffle } from '../utils/helpers';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

const CANVAS_H = 320;

export function HandwritingScreen({ navigation }: ScreenProps<'Handwriting'>) {
  const { c, sh } = useTheme();
  const app = useApp();
  const pool = app.getPool(app.scope);

  const deckRef = useRef<Item[]>([]);
  const draw = useCallback(() => {
    if (deckRef.current.length === 0) deckRef.current = shuffle(pool);
    return deckRef.current.pop() as Item;
  }, [pool]);

  const [target, setTarget] = useState<Item | null>(() => (pool.length ? draw() : null));
  const [revealed, setRevealed] = useState(false);
  const [guide, setGuide] = useState(false);
  const [done, setDone] = useState({ c: 0, t: 0 });
  const canvasRef = useRef<DrawCanvasHandle>(null);

  // reset deck + target when scope/pool changes
  useEffect(() => {
    deckRef.current = [];
    setRevealed(false);
    canvasRef.current?.clear();
    setTarget(pool.length ? draw() : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.scope, pool.length]);

  const src = target ? itemAudio(target, app.audioSet) : null;
  const hasAudio = src != null;
  const playId = target ? 'hw-' + itemKey(target) : null;

  useEffect(() => {
    if (target && src != null && playId) {
      const id = setTimeout(() => AudioBus.play(src, playId), 300);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, app.audioSet]);

  function next(got: boolean) {
    setDone((d) => ({ c: d.c + (got ? 1 : 0), t: d.t + 1 }));
    canvasRef.current?.clear();
    setRevealed(false);
    setTarget(draw());
  }

  if (!target) {
    return (
      <Screen maxWidth={560}>
        <ScopeToggle />
        <EmptyState
          khmer="សូន្យ"
          title="Nothing to write yet"
          message="Enable some characters in this scope to start the handwriting drill."
          ctaTitle="Open Settings"
          onCta={() => navigation.navigate('Settings')}
        />
      </Screen>
    );
  }

  const isVowel = target.kind === 'vowel';

  return (
    <Screen maxWidth={560}>
      <ScopeToggle />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
        <View>
          <Text style={{ fontFamily: MONO.semibold, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3 }}>
            {hasAudio ? 'Hear it — then write it' : 'Read it — then write it'}
          </Text>
          <Text style={{ fontFamily: DISPLAY.bold, fontSize: 17, color: c.ink, marginTop: 3 }}>
            {hasAudio ? 'Draw the character you hear' : isVowel ? 'Draw this vowel' : 'Draw this character'}
          </Text>
        </View>
        {hasAudio ? (
          <PlayButton item={target} size={52} playId={playId ?? undefined} />
        ) : (
          <View style={[{ alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 14, backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.line }, sh.sm]}>
            <Text style={{ fontFamily: MONO.semibold, fontSize: 24, color: c.ink }}>{itemRoman(target)}</Text>
            <Text style={{ fontFamily: MONO.semibold, fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: c.ink3 }}>â · ô</Text>
          </View>
        )}
      </View>

      {/* Canvas card */}
      <View style={[{ borderRadius: 20, borderWidth: 1.5, borderColor: c.line, backgroundColor: c.surface, overflow: 'hidden' }, sh.sm]}>
        {/* gridlines */}
        <View pointerEvents="none" style={{ position: 'absolute', left: '50%', top: CANVAS_H * 0.08, bottom: CANVAS_H * 0.08, width: 1, backgroundColor: c.line }} />
        <View pointerEvents="none" style={{ position: 'absolute', top: '50%', left: '8%', right: '8%', height: 1, backgroundColor: c.line }} />
        {/* guide / answer overlays */}
        {guide && !revealed && (
          <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Glyph size={200} color={c.ink} style={{ opacity: 0.07 }}>
              {itemGlyph(target)}
            </Glyph>
          </View>
        )}
        {revealed && (
          <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <Glyph size={200} color={c.accent} style={{ opacity: 0.4 }}>
              {itemGlyph(target)}
            </Glyph>
          </View>
        )}
        <DrawCanvas ref={canvasRef} height={CANVAS_H} color={c.ink} />
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Pressable
          onPress={() => canvasRef.current?.clear()}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}
        >
          <Icon name="eraser" size={17} color={c.ink2} />
          <Text style={{ fontFamily: UI.semibold, fontSize: 13.5, color: c.ink2 }}>Clear</Text>
        </Pressable>
        <Pressable
          onPress={() => setGuide((g) => !g)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            paddingVertical: 11,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: guide ? c.accent : c.line,
            backgroundColor: guide ? c.accentSoft : c.surface,
          }}
        >
          <Icon name="grid" size={16} color={guide ? c.accentInk : c.ink2} />
          <Text style={{ fontFamily: UI.semibold, fontSize: 13.5, color: guide ? c.accentInk : c.ink2 }}>Guide</Text>
        </Pressable>
        {!revealed && (
          <Btn title="Reveal" icon="check" flex={1} onPress={() => setRevealed(true)} />
        )}
      </View>

      {revealed && (
        <>
          <View style={[{ marginTop: 16, borderRadius: 20, borderWidth: 1.5, borderColor: c.line, backgroundColor: c.surface2, padding: 20, alignItems: 'center' }, sh.sm]}>
            <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 24, color: c.ink }}>{itemRoman(target)}</Text>
            <Text style={{ fontFamily: MONO.regular, fontSize: 14, color: c.ink2, marginTop: 2 }}>
              {isVowel ? 'dependent vowel · ' + target.note : target.ipa + ' · ' + SERIES[target.series].label}
            </Text>
            {hasAudio && (
              <View style={{ marginTop: 12 }}>
                <PlayButton item={target} size={44} ghost playId={'hwr-' + itemKey(target)} />
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={() => next(false)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: c.badSoft, borderWidth: 1.5, borderColor: c.bad }}
            >
              <Icon name="close" size={18} sw={2.4} color={c.bad} />
              <Text style={{ fontFamily: UI.bold, fontSize: 15, color: c.bad }}>Missed it</Text>
            </Pressable>
            <Pressable
              onPress={() => next(true)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: c.good }}
            >
              <Icon name="check" size={18} sw={2.4} color="#fff" />
              <Text style={{ fontFamily: UI.bold, fontSize: 15, color: '#fff' }}>Got it</Text>
            </Pressable>
          </View>
        </>
      )}

      <Text style={{ textAlign: 'center', marginTop: 14, fontFamily: MONO.regular, fontSize: 12.5, color: c.ink3 }}>
        {done.t > 0 ? `${done.c} / ${done.t} recalled this session` : 'Tip: turn on Guide to trace the first few'}
      </Text>
    </Screen>
  );
}
