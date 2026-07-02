/** Minimal cross-platform slider (drag or tap the track). No native dependency. */
import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function Slider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const { c, sh } = useTheme();
  const [w, setW] = useState(0);
  const widthRef = useRef(0);

  const setFromX = (x: number) => {
    const width = widthRef.current;
    if (width <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, snapped));
    onChange(parseFloat(clamped.toFixed(4)));
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
        onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [min, max, step],
  );

  const ratio = max > min ? (value - min) / (max - min) : 0;

  return (
    <View
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        widthRef.current = width;
        setW(width);
      }}
      style={{ height: 28, justifyContent: 'center' }}
      {...responder.panHandlers}
    >
      <View style={{ height: 8, borderRadius: 999, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line }}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${ratio * 100}%`, backgroundColor: c.accent, borderRadius: 999 }} />
      </View>
      <View
        style={[
          {
            position: 'absolute',
            left: Math.max(0, ratio * w - 13),
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: c.accent,
            borderWidth: 3,
            borderColor: c.surface,
          },
          sh.sm,
        ]}
      />
    </View>
  );
}
