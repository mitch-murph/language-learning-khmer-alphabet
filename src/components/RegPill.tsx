/** Register pill (â-series / ô-series) with a coloured dot. */
import React from 'react';
import { Text, View } from 'react-native';
import { REGISTER, RegisterKey } from '../data/khmer';
import { UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';

export function RegPill({ register }: { register: RegisterKey }) {
  const { c } = useTheme();
  const r = REGISTER[register];
  const soft = register === 'a' ? c.aregSoft : c.oregSoft;
  const ink = register === 'a' ? c.aregInk : c.oregInk;
  const dot = register === 'a' ? c.areg : c.oreg;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: soft,
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} />
      <Text style={{ fontFamily: UI.semibold, fontSize: 12, color: ink }}>{r.label}</Text>
    </View>
  );
}
