import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Glyph } from '../components/Glyph';
import { Icon, IconName } from '../components/Icon';
import { Eyebrow, Screen } from '../components/ui';
import { CONSONANTS } from '../data/khmer';
import { DISPLAY, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

interface Mode {
  icon: IconName;
  title: string;
  desc: string;
  route: keyof import('../navigation/types').RootStackParamList;
}

const MODES: Mode[] = [
  { icon: 'ear', title: 'Sound → Character', desc: 'Hear a sound, then pick the matching glyph from four choices.', route: 'QuizSC' },
  { icon: 'grid', title: 'Character → Sound', desc: 'See a glyph, then choose the correct sound — compare all four.', route: 'QuizCS' },
  { icon: 'pencil', title: 'Handwriting', desc: 'Hear a character and draw it, then reveal and grade yourself.', route: 'Handwriting' },
  { icon: 'link', title: 'Match', desc: 'Pair every glyph with its sound until the board is cleared.', route: 'Match' },
  { icon: 'cards', title: 'Flashcards', desc: 'Flip through glyph and details at your own pace.', route: 'Flashcards' },
  { icon: 'ear', title: 'Hands-free', desc: 'Autoplay the alphabet at any speed — study while you drive.', route: 'Autoplay' },
  { icon: 'sliders', title: 'Settings', desc: 'Choose which characters your quizzes draw from.', route: 'Settings' },
];

function ModeCard({
  mode,
  onPress,
}: {
  mode: Mode;
  onPress: () => void;
}) {
  const { c, sh } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexGrow: 1,
          flexBasis: 260,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: pressed ? c.line2 : c.line,
          borderRadius: 20,
          padding: 20,
          gap: 10,
          transform: [{ translateY: pressed ? -3 : 0 }],
        },
        sh.sm,
      ]}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          backgroundColor: c.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={mode.icon} size={24} color={c.accentInk} />
      </View>
      <Text style={{ fontFamily: DISPLAY.bold, fontSize: 19, color: c.ink, letterSpacing: -0.4 }}>
        {mode.title}
      </Text>
      <Text style={{ fontFamily: UI.regular, fontSize: 13.5, color: c.ink2, lineHeight: 19 }}>
        {mode.desc}
      </Text>
      <View style={{ position: 'absolute', top: 20, right: 20 }}>
        <Icon name="next" size={20} color={c.ink3} />
      </View>
    </Pressable>
  );
}

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { c, sh } = useTheme();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width - 40, 1080);
  const twoCol = contentW > 560;

  const samples = [CONSONANTS[0], CONSONANTS[2], CONSONANTS[5], CONSONANTS[10]];

  return (
    <Screen>
      {/* Hero */}
      <View style={{ marginTop: 4, marginBottom: 22, paddingHorizontal: 2 }}>
        <Eyebrow color={c.accentInk}>អក្សរខ្មែរ · The Khmer script</Eyebrow>
        <Text
          style={{
            fontFamily: DISPLAY.extrabold,
            fontSize: 38,
            lineHeight: 40,
            letterSpacing: -0.9,
            color: c.ink,
            marginTop: 10,
            marginBottom: 6,
          }}
        >
          Learn to read & write <Glyph size={34}>ខ្មែរ</Glyph>
        </Text>
        <Text style={{ fontFamily: UI.regular, fontSize: 16, color: c.ink2, lineHeight: 24, maxWidth: 460 }}>
          All 33 consonants and the vowels — grouped the way they’re really taught. Listen, explore,
          and quiz yourself in two native voices.
        </Text>
      </View>

      {/* Explore */}
      <Eyebrow style={{ marginBottom: 12, marginHorizontal: 2 }}>Explore</Eyebrow>
      <Pressable
        onPress={() => navigation.navigate('Browse')}
        style={({ pressed }) => [
          {
            backgroundColor: c.surface2,
            borderWidth: 1,
            borderColor: pressed ? c.line2 : c.line,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            flexDirection: twoCol ? 'row' : 'column',
            gap: 22,
            alignItems: twoCol ? 'center' : 'flex-start',
          },
          sh.sm,
        ]}
      >
        <View style={{ flex: 1, gap: 10 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              backgroundColor: c.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="grid" size={26} color={c.accentInk} />
          </View>
          <Text style={{ fontFamily: DISPLAY.bold, fontSize: 23, color: c.ink, letterSpacing: -0.4 }}>
            Browse the alphabet
          </Text>
          <Text style={{ fontFamily: UI.regular, fontSize: 14.5, color: c.ink2, lineHeight: 21, maxWidth: 340 }}>
            Every character in proper order, grouped by sound family. Tap any tile to hear it, or
            open it for mnemonics, example words, and look-alikes.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {samples.map((s) => (
            <View
              key={s.glyph}
              style={[
                {
                  width: 60,
                  height: 70,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: c.line,
                  backgroundColor: s.register === 'a' ? c.aregSoft : c.oregSoft,
                },
                sh.sm,
              ]}
            >
              <Glyph size={34} color={s.register === 'a' ? c.aregInk : c.oregInk}>
                {s.glyph}
              </Glyph>
            </View>
          ))}
        </View>
      </Pressable>

      {/* Practice */}
      <Eyebrow style={{ marginBottom: 12, marginHorizontal: 2 }}>Practice</Eyebrow>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {MODES.map((m, i) => (
          <ModeCard
            key={m.title + i}
            mode={m}
            onPress={() => navigation.navigate(m.route as never)}
          />
        ))}
      </View>
    </Screen>
  );
}
