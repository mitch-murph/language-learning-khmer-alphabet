/**
 * App context — shared practice state: active voice, which characters are
 * enabled, the practice scope, and the derived item pools. All persisted.
 */
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { Consonant, CONSONANTS, Item, Vowel, VOWELS } from '../data/khmer';

export type Scope = 'consonants' | 'vowels' | 'mixed';

interface AppValue {
  audioSet: 1 | 2;
  setAudioSet: (s: 1 | 2) => void;
  enabled: string[];
  setEnabled: React.Dispatch<React.SetStateAction<string[]>>;
  enabledVowels: string[];
  setEnabledVowels: React.Dispatch<React.SetStateAction<string[]>>;
  enabledConsonants: Consonant[];
  enabledVowelItems: Vowel[];
  scope: Scope;
  setScope: (s: Scope) => void;
  getPool: (scope: Scope) => Item[];
}

const AppCtx = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [audioSet, setAudioSet] = usePersistedState<1 | 2>('km_audioset', 1);
  const [enabled, setEnabled] = usePersistedState<string[]>(
    'km_enabled',
    CONSONANTS.map((c) => c.glyph),
  );
  const [enabledVowels, setEnabledVowels] = usePersistedState<string[]>(
    'km_enabled_vowels',
    VOWELS.map((v) => v.id),
  );
  const [scope, setScope] = usePersistedState<Scope>('km_scope', 'consonants');

  const enabledConsonants = useMemo(
    () => CONSONANTS.filter((c) => enabled.indexOf(c.glyph) >= 0),
    [enabled],
  );
  const enabledVowelItems = useMemo(
    () => VOWELS.filter((v) => enabledVowels.indexOf(v.id) >= 0),
    [enabledVowels],
  );
  const mixedPool = useMemo<Item[]>(
    () => [...enabledConsonants, ...enabledVowelItems],
    [enabledConsonants, enabledVowelItems],
  );

  const getPool = useCallback(
    (sc: Scope): Item[] => {
      if (sc === 'vowels') return enabledVowelItems;
      if (sc === 'mixed') return mixedPool;
      return enabledConsonants;
    },
    [enabledConsonants, enabledVowelItems, mixedPool],
  );

  const value: AppValue = {
    audioSet,
    setAudioSet,
    enabled,
    setEnabled,
    enabledVowels,
    setEnabledVowels,
    enabledConsonants,
    enabledVowelItems,
    scope,
    setScope,
    getPool,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): AppValue {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}
