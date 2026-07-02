/** Animated "listening" waveform bars. */
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export function Wave({
  color = '#fff',
  bars = 5,
  maxHeight = 34,
  minHeight = 12,
  barWidth = 5,
}: {
  color?: string;
  bars?: number;
  maxHeight?: number;
  minHeight?: number;
  barWidth?: number;
}) {
  const values = useRef(
    Array.from({ length: bars }, () => new Animated.Value(minHeight)),
  ).current;

  useEffect(() => {
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 120),
          Animated.timing(v, { toValue: maxHeight, duration: 350, useNativeDriver: false }),
          Animated.timing(v, { toValue: minHeight, duration: 350, useNativeDriver: false }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [values, maxHeight, minHeight]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: maxHeight }}>
      {values.map((v, i) => (
        <Animated.View
          key={i}
          style={{ width: barWidth, borderRadius: 3, backgroundColor: color, height: v }}
        />
      ))}
    </View>
  );
}
