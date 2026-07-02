/**
 * Design tokens ported from the prototype's CSS custom properties.
 * Light + dark palettes, radii, and shadow style objects (RN-friendly).
 */
import { ViewStyle } from 'react-native';

export interface Colors {
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  line2: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  areg: string;
  aregSoft: string;
  aregInk: string;
  oreg: string;
  oregSoft: string;
  oregInk: string;
  good: string;
  goodSoft: string;
  bad: string;
  badSoft: string;
}

export const lightColors: Colors = {
  bg: '#F6F1E7',
  bg2: '#EFE7D8',
  surface: '#FFFDF8',
  surface2: '#FBF5EC',
  ink: '#2A251F',
  ink2: '#6E6456',
  ink3: '#9C907E',
  line: '#E8DFD0',
  line2: '#DBD0BD',
  accent: '#DD8A2A',
  accentInk: '#854E12',
  accentSoft: '#F7E8CF',
  areg: '#D4842A',
  aregSoft: '#F6E7CE',
  aregInk: '#834C12',
  oreg: '#2E7E74',
  oregSoft: '#D4E8E4',
  oregInk: '#1C5852',
  good: '#43905E',
  goodSoft: '#D9EBDF',
  bad: '#C0533B',
  badSoft: '#F3DED7',
};

export const darkColors: Colors = {
  bg: '#17140F',
  bg2: '#1E1A14',
  surface: '#221E17',
  surface2: '#2A251D',
  ink: '#F2EBDD',
  ink2: '#B9AE9B',
  ink3: '#857B69',
  line: '#332D24',
  line2: '#403930',
  accent: '#E79A3E',
  accentInk: '#F2C68A',
  accentSoft: '#3A2C16',
  areg: '#E79A3E',
  aregSoft: '#3A2C16',
  aregInk: '#F2C68A',
  oreg: '#54B3A6',
  oregSoft: '#15302C',
  oregInk: '#8FD6CB',
  good: '#5DB57C',
  goodSoft: '#18301F',
  bad: '#D9745A',
  badSoft: '#341E17',
};

/** Accent swatch options offered in Settings. */
export const ACCENT_OPTIONS = ['#DD8A2A', '#C0573A', '#2E7E74', '#5566C7', '#9A5BA0'];

export const radii = {
  sm: 9,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const GLYPH_SCALE_MIN = 0.8;
export const GLYPH_SCALE_MAX = 1.35;

export function shadows(dark: boolean): {
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
} {
  const c = dark ? '#000000' : '#3C2D14';
  return {
    sm: {
      shadowColor: c,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: dark ? 0.3 : 0.06,
      shadowRadius: 6,
      elevation: 1,
    },
    md: {
      shadowColor: c,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: dark ? 0.4 : 0.09,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: c,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: dark ? 0.55 : 0.16,
      shadowRadius: 40,
      elevation: 10,
    },
  };
}
