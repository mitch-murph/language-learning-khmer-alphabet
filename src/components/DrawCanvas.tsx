/**
 * Cross-platform drawing surface (web + Android) using react-native-svg paths
 * driven by PanResponder. Exposes an imperative clear().
 */
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface DrawCanvasHandle {
  clear: () => void;
}

interface DrawCanvasProps {
  height: number;
  color: string;
  strokeWidth?: number;
}

export const DrawCanvas = forwardRef<DrawCanvasHandle, DrawCanvasProps>(
  ({ height, color, strokeWidth = 9 }, ref) => {
    const [paths, setPaths] = useState<string[]>([]);
    const [current, setCurrent] = useState<string>('');
    const currentRef = useRef<string>('');

    useImperativeHandle(ref, () => ({
      clear: () => {
        currentRef.current = '';
        setCurrent('');
        setPaths([]);
      },
    }));

    const responder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: (e) => {
            const { locationX, locationY } = e.nativeEvent;
            currentRef.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
            setCurrent(currentRef.current);
          },
          onPanResponderMove: (e) => {
            const { locationX, locationY } = e.nativeEvent;
            currentRef.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
            setCurrent(currentRef.current);
          },
          onPanResponderRelease: () => {
            const done = currentRef.current;
            currentRef.current = '';
            setCurrent('');
            if (done) setPaths((p) => [...p, done]);
          },
        }),
      [],
    );

    return (
      <View style={{ height }} {...responder.panHandlers}>
        <Svg width="100%" height={height}>
          {paths.map((d, i) => (
            <Path
              key={i}
              d={d}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {current !== '' && (
            <Path
              d={current}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>
    );
  },
);

DrawCanvas.displayName = 'DrawCanvas';
