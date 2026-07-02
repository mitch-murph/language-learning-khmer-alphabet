import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { itemAudio } from '../audio/itemAudio';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { PlayButton } from '../components/PlayButton';
import { ScopeToggle } from '../components/ScopeToggle';
import { Screen } from '../components/ui';
import { useApp } from '../context/AppContext';
import { Item, itemGlyph, itemKey, itemRoman, siblings } from '../data/khmer';
import { sampleOthers, shuffle } from '../utils/helpers';
import { DISPLAY, MONO } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';
import { EmptyQuiz, QuizHead, useQuizDeck } from './quizCommon';

interface Q {
  target: Item;
  options: Item[];
}

export function QuizCSScreen({ navigation }: ScreenProps<'QuizCS'>) {
  const { c, sh } = useTheme();
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

  function choose(opt: Item) {
    if (picked || !q) return;
    const ok = itemKey(opt) === itemKey(q.target);
    setPicked(itemKey(opt));
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setTimeout(makeQ, ok ? 900 : 1600);
  }

  if (pool.length < 4)
    return <EmptyQuiz scope={app.scope} onSettings={() => navigation.navigate('Settings')} />;
  if (!q) return <Screen maxWidth={640}><ScopeToggle /></Screen>;

  const targetKey = itemKey(q.target);
  const audioOpts = itemAudio(q.target, app.audioSet) != null;

  return (
    <Screen maxWidth={640}>
      <ScopeToggle />
      <QuizHead correct={score.correct} total={score.total} />

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontFamily: MONO.semibold, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: c.ink3, marginBottom: 16, textAlign: 'center' }}>
          {audioOpts ? 'Play each option, then pick the one that matches' : 'Which reading does this make?'}
        </Text>
        <Glyph size={120} scaled>
          {itemGlyph(q.target)}
        </Glyph>
        {q.target.kind === 'vowel' && (
          <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3, marginTop: 4 }}>
            the vowel shown on ក · focus on the vowel
          </Text>
        )}
      </View>

      <View style={{ gap: 13 }}>
        {q.options.map((opt, i) => {
          const k = itemKey(opt);
          let bg = c.surface;
          let border = c.line;
          let lblColor = c.ink2;
          if (picked) {
            if (k === targetKey) {
              bg = c.goodSoft;
              border = c.good;
              lblColor = c.good;
            } else if (k === picked) {
              bg = c.badSoft;
              border = c.bad;
              lblColor = c.bad;
            }
          }
          const showLabel = !audioOpts || !!picked;
          return (
            <Pressable
              key={k}
              onPress={() => choose(opt)}
              disabled={!!picked}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 16,
                  paddingHorizontal: 18,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: border,
                  backgroundColor: bg,
                },
                sh.sm,
              ]}
            >
              {audioOpts && <PlayButton item={opt} size={40} ghost playId={'cs-' + i + '-' + k} />}
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: MONO.semibold, fontSize: 14, color: c.ink2 }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontFamily: MONO.semibold, fontSize: 15, color: lblColor }}>
                {showLabel ? itemRoman(opt) : 'Option ' + (i + 1)}
              </Text>
              {picked && k === targetKey && <Icon name="check" size={20} sw={2.4} color={c.good} />}
            </Pressable>
          );
        })}
      </View>

      <View style={{ alignItems: 'center', marginTop: 20, minHeight: 54, justifyContent: 'center' }}>
        {picked &&
          (picked === targetKey ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.goodSoft, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 999 }}>
              <Icon name="check" size={20} sw={2.4} color={c.good} />
              <Text style={{ fontFamily: DISPLAY.bold, fontSize: 18, color: c.good }}>
                Correct — that’s {itemRoman(q.target)}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.badSoft, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 999 }}>
              <Icon name="close" size={18} sw={2.4} color={c.bad} />
              <Text style={{ fontFamily: DISPLAY.bold, fontSize: 18, color: c.bad }}>
                It was {itemRoman(q.target)}
              </Text>
            </View>
          ))}
      </View>
    </Screen>
  );
}
