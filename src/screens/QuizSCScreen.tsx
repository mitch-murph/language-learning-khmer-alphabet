import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { AudioBus, usePlaying } from '../audio/AudioBus';
import { itemAudio } from '../audio/itemAudio';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { ScopeToggle } from '../components/ScopeToggle';
import { Screen } from '../components/ui';
import { Wave } from '../components/Wave';
import { useApp } from '../context/AppContext';
import { Item, itemGlyph, itemKey, itemRoman, siblings } from '../data/khmer';
import { sampleOthers, shuffle } from '../utils/helpers';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';
import { EmptyQuiz, QuizHead, useQuizDeck } from './quizCommon';

interface Q {
  target: Item;
  options: Item[];
}

export function QuizSCScreen({ navigation }: ScreenProps<'QuizSC'>) {
  const { c, sh } = useTheme();
  const { width } = useWindowDimensions();
  const app = useApp();
  const pool = app.getPool(app.scope);
  const draw = useQuizDeck(pool);
  const [q, setQ] = useState<Q | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const makeQ = useCallback(() => {
    if (pool.length < 4) {
      setQ(null);
      return;
    }
    const target = draw();
    const distract = sampleOthers(siblings(target), target, 3);
    setPicked(null);
    setQ({ target, options: shuffle([target, ...distract]) });
  }, [draw, pool.length]);

  useEffect(() => {
    makeQ();
  }, [makeQ]);

  const src = q ? itemAudio(q.target, app.audioSet) : null;
  const hasAudio = src != null;
  const playId = q ? 'q-' + itemKey(q.target) : null;
  const playing = usePlaying(playId);

  const playPrompt = useCallback(() => {
    if (q && src != null && playId) AudioBus.play(src, playId);
  }, [q, src, playId]);

  useEffect(() => {
    if (q && hasAudio) {
      const id = setTimeout(playPrompt, 260);
      return () => clearTimeout(id);
    }
  }, [q, app.audioSet]);

  function choose(opt: Item) {
    if (picked || !q) return;
    const ok = itemKey(opt) === itemKey(q.target);
    setPicked(itemKey(opt));
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setTimeout(makeQ, ok ? 850 : 1500);
  }

  if (pool.length < 4)
    return <EmptyQuiz scope={app.scope} onSettings={() => navigation.navigate('Settings')} />;
  if (!q) return <Screen maxWidth={640}><ScopeToggle /></Screen>;

  const targetKey = itemKey(q.target);
  const optW = (Math.min(width - 40, 640) - 13) / 2;

  return (
    <Screen maxWidth={640}>
      <ScopeToggle />
      <QuizHead correct={score.correct} total={score.total} />

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontFamily: MONO.semibold, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: c.ink3, marginBottom: 16, textAlign: 'center' }}>
          {hasAudio ? 'Listen — which character is this?' : 'Which character has this reading?'}
        </Text>
        {hasAudio ? (
          <>
            <Pressable
              onPress={playPrompt}
              style={({ pressed }) => [
                {
                  width: 120,
                  height: 120,
                  borderRadius: 32,
                  backgroundColor: c.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
                sh.md,
              ]}
            >
              {playing ? <Wave /> : <Icon name="play" size={44} color="#fff" />}
            </Pressable>
            <Pressable
              onPress={playPrompt}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }}
            >
              <Icon name="refresh" size={15} color={c.ink2} />
              <Text style={{ fontFamily: UI.semibold, fontSize: 13.5, color: c.ink2 }}>Play again</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={[{ minWidth: 200, paddingVertical: 22, paddingHorizontal: 30, borderRadius: 28, backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.line, alignItems: 'center', gap: 6 }, sh.sm]}>
              <Text style={{ fontFamily: MONO.semibold, fontSize: 44, color: c.ink }}>{itemRoman(q.target)}</Text>
              <Text style={{ fontFamily: MONO.semibold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: c.ink3 }}>
                â-series · ô-series
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line }}>
              <Icon name="ear" size={13} color={c.ink3} />
              <Text style={{ fontFamily: UI.regular, fontSize: 12, color: c.ink3 }}>Vowel audio coming soon</Text>
            </View>
          </>
        )}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 13 }}>
        {q.options.map((opt) => {
          const k = itemKey(opt);
          let bg = c.surface;
          let border = c.line;
          let glyphColor = c.ink;
          let opacity = 1;
          if (picked) {
            if (k === targetKey) {
              bg = c.goodSoft;
              border = c.good;
              glyphColor = c.good;
            } else if (k === picked) {
              bg = c.badSoft;
              border = c.bad;
              glyphColor = c.bad;
            } else {
              opacity = 0.45;
            }
          }
          return (
            <Pressable
              key={k}
              onPress={() => choose(opt)}
              disabled={!!picked}
              style={[
                {
                  width: optW,
                  aspectRatio: 1.25,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: border,
                  backgroundColor: bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity,
                },
                sh.sm,
              ]}
            >
              <Glyph size={58} scaled color={glyphColor}>
                {itemGlyph(opt)}
              </Glyph>
            </Pressable>
          );
        })}
      </View>

      <View style={{ alignItems: 'center', marginTop: 20, minHeight: 54, justifyContent: 'center' }}>
        {picked &&
          (picked === targetKey ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.goodSoft, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 999 }}>
              <Icon name="check" size={20} sw={2.4} color={c.good} />
              <Text style={{ fontFamily: DISPLAY.bold, fontSize: 18, color: c.good }}>Correct</Text>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.badSoft, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 999 }}>
                <Icon name="close" size={18} sw={2.4} color={c.bad} />
                <Text style={{ fontFamily: DISPLAY.bold, fontSize: 18, color: c.bad }}>Not quite</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Text style={{ fontFamily: UI.regular, fontSize: 14, color: c.ink2 }}>It’s </Text>
                <Glyph size={20}>{itemGlyph(q.target)}</Glyph>
                <Text style={{ fontFamily: UI.semibold, fontSize: 14, color: c.ink2 }}> — {itemRoman(q.target)}</Text>
              </View>
            </>
          ))}
      </View>
    </Screen>
  );
}
