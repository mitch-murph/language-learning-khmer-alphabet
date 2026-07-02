/**
 * Font family constants + the useFonts map.
 * Names match the exports of the @expo-google-fonts/* packages.
 */
import {
  useFonts as useExpoFonts,
} from 'expo-font';

import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  SplineSansMono_400Regular,
  SplineSansMono_500Medium,
  SplineSansMono_600SemiBold,
} from '@expo-google-fonts/spline-sans-mono';
import {
  NotoSerifKhmer_400Regular,
  NotoSerifKhmer_600SemiBold,
  NotoSerifKhmer_700Bold,
} from '@expo-google-fonts/noto-serif-khmer';
import {
  NotoSansKhmer_400Regular,
  NotoSansKhmer_600SemiBold,
  NotoSansKhmer_700Bold,
} from '@expo-google-fonts/noto-sans-khmer';
import {
  Battambang_400Regular,
  Battambang_700Bold,
} from '@expo-google-fonts/battambang';
import {
  Hanuman_400Regular,
  Hanuman_700Bold,
} from '@expo-google-fonts/hanuman';

/** UI / body sans */
export const UI = {
  regular: 'HankenGrotesk_400Regular',
  medium: 'HankenGrotesk_500Medium',
  semibold: 'HankenGrotesk_600SemiBold',
  bold: 'HankenGrotesk_700Bold',
};

/** Display / headings */
export const DISPLAY = {
  bold: 'BricolageGrotesque_700Bold',
  extrabold: 'BricolageGrotesque_800ExtraBold',
};

/** Mono / labels / romanization */
export const MONO = {
  regular: 'SplineSansMono_400Regular',
  medium: 'SplineSansMono_500Medium',
  semibold: 'SplineSansMono_600SemiBold',
};

/** Khmer glyph fonts — the `glyphFont` setting picks one of these families. */
export const GLYPH_FONTS: Record<string, string> = {
  'Noto Serif Khmer': 'NotoSerifKhmer_400Regular',
  'Noto Sans Khmer': 'NotoSansKhmer_400Regular',
  Battambang: 'Battambang_400Regular',
  Hanuman: 'Hanuman_400Regular',
};

export const GLYPH_FONT_OPTIONS = Object.keys(GLYPH_FONTS);

export function useAppFonts(): boolean {
  const [loaded] = useExpoFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    SplineSansMono_400Regular,
    SplineSansMono_500Medium,
    SplineSansMono_600SemiBold,
    NotoSerifKhmer_400Regular,
    NotoSerifKhmer_600SemiBold,
    NotoSerifKhmer_700Bold,
    NotoSansKhmer_400Regular,
    NotoSansKhmer_600SemiBold,
    NotoSansKhmer_700Bold,
    Battambang_400Regular,
    Battambang_700Bold,
    Hanuman_400Regular,
    Hanuman_700Bold,
  });
  return loaded;
}
