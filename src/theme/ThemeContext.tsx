/**
 * Theme provider — resolves the active palette (light/dark), the tweakable accent,
 * Khmer glyph font and glyph scale, plus shadow presets. All settings persist.
 */
import React, { createContext, useContext, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';
import { GLYPH_FONTS } from './fonts';
import {
  Colors,
  darkColors,
  lightColors,
  radii,
  shadows,
} from './tokens';

interface ThemeValue {
  c: Colors;
  dark: boolean;
  setDark: (v: boolean) => void;
  accent: string;
  setAccent: (v: string) => void;
  glyphFont: string;
  setGlyphFont: (v: string) => void;
  glyphScale: number;
  setGlyphScale: (v: number) => void;
  glyphFamily: string;
  radii: typeof radii;
  sh: { sm: ViewStyle; md: ViewStyle; lg: ViewStyle };
}

const ThemeCtx = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = usePersistedState('km_dark', false);
  const [accent, setAccent] = usePersistedState('km_accent', '#DD8A2A');
  const [glyphFont, setGlyphFont] = usePersistedState('km_glyphfont', 'Noto Serif Khmer');
  const [glyphScale, setGlyphScale] = usePersistedState('km_glyphscale', 1);

  const value = useMemo<ThemeValue>(() => {
    const base = dark ? darkColors : lightColors;
    // The accent swatch overrides only the base accent (as in the prototype).
    const c: Colors = { ...base, accent };
    return {
      c,
      dark,
      setDark,
      accent,
      setAccent,
      glyphFont,
      setGlyphFont,
      glyphScale,
      setGlyphScale,
      glyphFamily: GLYPH_FONTS[glyphFont] || GLYPH_FONTS['Noto Serif Khmer'],
      radii,
      sh: shadows(dark),
    };
  }, [dark, accent, glyphFont, glyphScale, setDark, setAccent, setGlyphFont, setGlyphScale]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error('useTheme must be used within ThemeProvider');
  return v;
}
