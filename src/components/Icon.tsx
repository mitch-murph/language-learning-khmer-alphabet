/**
 * Inline stroke icons ported from the prototype's <Icon> component.
 * Rendered with react-native-svg; `currentColor` resolves via the Svg `color` prop.
 */
import React from 'react';
import Svg, {
  Circle,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
} from 'react-native-svg';

export type IconName =
  | 'back'
  | 'next'
  | 'down'
  | 'gear'
  | 'heart'
  | 'search'
  | 'check'
  | 'close'
  | 'shuffle'
  | 'refresh'
  | 'pencil'
  | 'eraser'
  | 'grid'
  | 'cards'
  | 'ear'
  | 'link'
  | 'trophy'
  | 'star'
  | 'play'
  | 'pause'
  | 'sliders'
  | 'moon'
  | 'sun'
  | 'home'
  | 'target'
  | 'flame'
  | 'bolt';

const SHAPES: Record<IconName, React.ReactNode> = {
  back: <Polyline points="15 5 8 12 15 19" />,
  next: <Polyline points="9 5 16 12 9 19" />,
  down: <Polyline points="6 9 12 16 18 9" />,
  gear: (
    <G>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </G>
  ),
  heart: <Path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7-1.3C19 11.6 12 20 12 20Z" />,
  search: (
    <G>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="m20 20-3.6-3.6" />
    </G>
  ),
  check: <Polyline points="4 12.5 9.5 18 20 6.5" />,
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  shuffle: (
    <G>
      <Path d="M3 5h4l10 14h4" />
      <Path d="M3 19h4l3-4.2M14.5 8.2 17 5h4" />
      <Polyline points="18 2.5 21 5 18 7.5" />
      <Polyline points="18 16.5 21 19 18 21.5" />
    </G>
  ),
  refresh: (
    <G>
      <Path d="M20 11a8 8 0 1 0-1.8 6" />
      <Polyline points="20 4 20 10 14 10" />
    </G>
  ),
  pencil: <Path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3ZM14.5 6.5l3 3" />,
  eraser: (
    <G>
      <Path d="M8 19h12" />
      <Path d="M5.5 15.5 13 8l5 5-6 6H8l-2.5-2.5a1.4 1.4 0 0 1 0-1Z" />
    </G>
  ),
  grid: (
    <G>
      <Rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <Rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <Rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <Rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </G>
  ),
  cards: (
    <G>
      <Rect x="3.5" y="6.5" width="13" height="14" rx="2.2" />
      <Path d="M7.5 4.2h9A3 3 0 0 1 19.5 7v11" />
    </G>
  ),
  ear: <Path d="M8 9a4 4 0 0 1 8 0c0 2.6-2.5 3.2-2.5 5.5A2.2 2.2 0 0 1 11 16.5M8.5 18.5A4.4 4.4 0 0 1 7 15" />,
  link: (
    <G>
      <Path d="M9 12h6" />
      <Path d="M10 8H8a4 4 0 0 0 0 8h2M14 8h2a4 4 0 0 1 0 8h-2" />
    </G>
  ),
  trophy: (
    <G>
      <Path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
      <Path d="M7 5H4v1.5A3.5 3.5 0 0 0 7 10M17 5h3v1.5A3.5 3.5 0 0 1 17 10M9.5 13.5 9 19h6l-.5-5.5M8 21h8" />
    </G>
  ),
  star: <Path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L5.5 9.7l5.9-.8Z" />,
  play: <Polygon points="8 5 19 12 8 19" fill="currentColor" stroke="none" />,
  pause: (
    <G>
      <Rect x="7" y="5" width="3.4" height="14" rx="1.2" fill="currentColor" stroke="none" />
      <Rect x="13.6" y="5" width="3.4" height="14" rx="1.2" fill="currentColor" stroke="none" />
    </G>
  ),
  sliders: (
    <G>
      <Path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <Circle cx="16" cy="7" r="2.2" />
      <Circle cx="8" cy="17" r="2.2" />
    </G>
  ),
  moon: <Path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" />,
  sun: (
    <G>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </G>
  ),
  home: <Path d="M4 11.5 12 4l8 7.5M6 10v10h12V10" />,
  target: (
    <G>
      <Circle cx="12" cy="12" r="8" />
      <Circle cx="12" cy="12" r="3.4" />
    </G>
  ),
  flame: <Path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.6.7-2.8 1.4-3.6.2 1 .9 1.8 1.8 2 .2-2.7 1.8-4.9 1.8-7.4Z" />,
  bolt: <Polygon points="13 2 5 13 11 13 10 22 19 10 13 10" fill="currentColor" stroke="none" />,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  sw?: number;
}

export function Icon({ name, size = 22, color = '#000', sw = 1.75 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SHAPES[name]}
    </Svg>
  );
}
