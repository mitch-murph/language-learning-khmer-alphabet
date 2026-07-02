/** Small shared UI primitives used across screens. */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { Glyph } from './Glyph';
import { Icon, IconName } from './Icon';

const MAXW = 1080;

/** Scrollable, centered screen container with a mount fade-in. */
export function Screen({
  children,
  maxWidth = MAXW,
  contentStyle,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [anim]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 20, paddingBottom: 80, paddingTop: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        style={[
          {
            width: '100%',
            maxWidth,
            opacity: anim,
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
            ],
          },
          contentStyle,
        ]}
      >
        {children}
      </Animated.View>
    </ScrollView>
  );
}

/** Primary / soft button with optional leading icon. */
export function Btn({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  flex,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'soft';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  flex?: number;
}) {
  const { c, sh } = useTheme();
  const primary = variant === 'primary';
  const fg = primary ? '#fff' : c.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 14,
          backgroundColor: primary ? c.accent : c.surface2,
          borderWidth: primary ? 0 : 1,
          borderColor: c.line,
          transform: [{ translateY: pressed ? 1 : 0 }],
          ...(flex != null ? { flex } : {}),
        },
        primary && sh.sm,
        style,
      ]}
    >
      {icon && <Icon name={icon} size={17} color={fg} />}
      <Text style={{ fontFamily: UI.semibold, fontSize: 15, color: fg }}>{title}</Text>
    </Pressable>
  );
}

/** Uppercase mono eyebrow / label. */
export function Eyebrow({
  children,
  color,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const { c } = useTheme();
  return (
    <Text
      style={[
        {
          fontFamily: MONO.semibold,
          fontSize: 12,
          letterSpacing: 1.8,
          textTransform: 'uppercase',
          color: color ?? c.ink3,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Centered empty state with a big Khmer word + message + optional CTA. */
export function EmptyState({
  khmer,
  title,
  message,
  ctaTitle,
  onCta,
}: {
  khmer: string;
  title?: string;
  message: string;
  ctaTitle?: string;
  onCta?: () => void;
}) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
      <Glyph size={40} color={c.ink2} style={{ marginBottom: 8 }}>
        {khmer}
      </Glyph>
      {title && (
        <Text
          style={{
            fontFamily: DISPLAY.bold,
            fontSize: 20,
            color: c.ink,
            marginBottom: 6,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}
      <Text
        style={{
          fontFamily: UI.regular,
          fontSize: 15,
          color: c.ink2,
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 22,
          marginBottom: 18,
        }}
      >
        {message}
      </Text>
      {ctaTitle && onCta && <Btn title={ctaTitle} onPress={onCta} icon="sliders" />}
    </View>
  );
}
