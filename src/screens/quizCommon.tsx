import React from 'react';
import { Text, View } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import { Glyph } from '../components/Glyph';
import { ScopeToggle } from '../components/ScopeToggle';
import { Btn, Screen } from '../components/ui';
import { Scope } from '../context/AppContext';
import { Item } from '../data/khmer';
import { shuffle } from '../utils/helpers';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';

/** Shuffle-draw deck over a pool: no repeats until exhausted, then reshuffle. */
export function useQuizDeck(pool: Item[]): () => Item {
  const deckRef = useRef<Item[]>([]);
  useEffect(() => {
    deckRef.current = [];
  }, [pool]);
  return useCallback(() => {
    if (deckRef.current.length === 0) deckRef.current = shuffle(pool);
    return deckRef.current.pop() as Item;
  }, [pool]);
}

export function EmptyQuiz({ scope, onSettings }: { scope: Scope; onSettings: () => void }) {
  const { c } = useTheme();
  const msg =
    scope === 'vowels'
      ? 'No vowels are enabled. Open Settings to switch some on.'
      : scope === 'mixed'
        ? 'Enable at least four characters across consonants and vowels in Settings.'
        : 'This drill needs four or more characters to choose from. Open Settings to widen your selection.';
  return (
    <Screen maxWidth={640}>
      <ScopeToggle />
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Glyph size={40} color={c.ink2} style={{ marginBottom: 10 }}>
          កៀក
        </Glyph>
        <Text style={{ fontFamily: DISPLAY.bold, fontSize: 20, color: c.ink, marginBottom: 6 }}>
          Not enough to practice
        </Text>
        <Text style={{ fontFamily: UI.regular, fontSize: 15, color: c.ink2, textAlign: 'center', maxWidth: 320, marginBottom: 18, lineHeight: 22 }}>
          {msg}
        </Text>
        <Btn title="Open Settings" icon="sliders" onPress={onSettings} />
      </View>
    </Screen>
  );
}

/** Score header shown at the top of both quiz screens. */
export function QuizHead({ correct, total }: { correct: number; total: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <View>
        <Text style={{ fontFamily: DISPLAY.extrabold, fontSize: 24, letterSpacing: -0.5, color: c.ink }}>
          {correct}
          <Text style={{ color: c.ink3, fontSize: 16 }}>/{total}</Text>
        </Text>
        <Text style={{ fontFamily: MONO.semibold, fontSize: 11.5, color: c.ink3, textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>
          Score
        </Text>
      </View>
    </View>
  );
}
