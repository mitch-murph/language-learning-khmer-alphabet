/**
 * Renders Khmer text with the selected glyph font. Combining vowel marks stack
 * on their base consonant, so we give a little vertical headroom to avoid clipping
 * on Android.
 */
import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface GlyphProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  /** Multiply size by the user's glyph-scale setting (used in tiles/options/chips). */
  scaled?: boolean;
  weight?: string;
  style?: TextStyle;
}

export function Glyph({ children, size = 40, color, scaled, weight, style }: GlyphProps) {
  const { glyphFamily, glyphScale, c } = useTheme();
  const fontSize = scaled ? size * glyphScale : size;
  return (
    <Text
      allowFontScaling={false}
      style={[
        {
          fontFamily: weight || glyphFamily,
          fontSize,
          lineHeight: fontSize * 1.18,
          color: color ?? c.ink,
          includeFontPadding: false,
          textAlign: 'center',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
