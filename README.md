# Aksar — Khmer Alphabet Learning App

A cross-platform (Android + Web) React Native app for learning to read and write the
Khmer script — all **33 consonants** and **23 dependent vowels**, grouped the way they
are traditionally taught, with two native-voice audio sets and six practice modes.

Rebuilt in **Expo + React Native + TypeScript** from the `design_handoff_khmer_alphabet`
HTML/React prototype. See [`ASSUMPTIONS.md`](./ASSUMPTIONS.md) for decisions made during
the port.

## Stack

- **Expo SDK 54** (React Native 0.81, React 19) — one codebase for Android + Web
- **TypeScript** (strict)
- **React Navigation** (native-stack) with a custom top bar
- **expo-audio** — global single-clip audio bus
- **react-native-svg** — icons + handwriting canvas
- **AsyncStorage** — persisted settings & progress
- **@expo-google-fonts** — Hanken Grotesk, Bricolage Grotesque, Spline Sans Mono, and
  the four Khmer glyph fonts (Noto Serif/Sans Khmer, Battambang, Hanuman)

## Run it

```bash
npm install

npm run web        # open in a browser
npm run android    # open on an Android device/emulator (needs Android SDK / Expo Go)
npm run typecheck  # tsc --noEmit
```

To scan for bundling errors without a device: `npx expo export --platform web`.

## Project structure

```
App.tsx                     Providers (SafeArea → Theme → App) + font gate
index.ts                    Expo entry
assets/audio/set{1,2}/*.mp3 Consonant audio (voice A / voice B), 01–33
src/
  data/
    khmer.ts                Typed dataset (consonants, vowels, series, register) + helpers
    audioAssets.ts          Static require() map for the 66 audio clips
  audio/
    AudioBus.ts             Single shared player + usePlaying() hook
    itemAudio.ts            item + voice-set → bundled clip (null for vowels for now)
  context/AppContext.tsx    audioSet, enabled sets, scope, derived pools (persisted)
  theme/
    tokens.ts               Light/dark palettes, radii, shadows
    fonts.ts                Font families + useAppFonts()
    ThemeContext.tsx        Resolved theme + tweaks (dark, accent, glyph font/scale)
  hooks/usePersistedState.ts  AsyncStorage-backed state
  components/               Icon, Glyph, PlayButton, VoiceToggle, RegPill, ScopeToggle,
                            Wave, Slider, DrawCanvas, ui primitives (Screen/Btn/…)
  navigation/               Stack navigator, custom TopBar, route types
  screens/                  Home, Browse, Detail, QuizSC, QuizCS, Match,
                            Handwriting, Flashcards, Autoplay, Settings
```

## Data & content

Ported essentially verbatim from the prototype's `data.js`. Example words and mnemonics
are a learning aid and deserve a native-speaker review pass before shipping.

**Vowel audio does not exist yet.** `VOWEL_AUDIO_AVAILABLE` in `src/data/khmer.ts` is
`false`; the UI falls back to showing romanized readings instead of a play button. To
enable it later: record `assets/audio/vowels/set{1,2}/01…23.mp3`, wire them into
`audioAssets.ts` / `itemAudio.ts`, and flip the flag.
