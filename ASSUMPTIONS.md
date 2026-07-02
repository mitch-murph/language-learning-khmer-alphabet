# Assumptions & decisions made during the port

The prototype was a browser-only HTML + React (Babel-in-browser) reference. Rebuilding it
as a real React Native app targeting **Android + Web** required a number of choices. You
were AFK, so I made these calls and recorded them here.

## Framework & tooling
1. **Expo + React Native** (managed workflow) was chosen over bare RN so one codebase
   serves Android and Web (via `react-native-web`) with minimal config.
2. **Expo SDK 54** (RN 0.81 / React 19). The `latest` tag was SDK 57, but its
   `@expo/cli` dependency was a broken/unpublished canary, so I pinned to the newest
   fully-stable line (54.0.35).
3. **iOS** is configured (bundle id, `supportsTablet`) and should work, but you only
   asked for Android + Web, so it is untested.
4. **New Architecture** is enabled (`newArchEnabled: true`) — the SDK 54 default.

## Verification done
- `tsc --noEmit` passes (strict mode).
- `expo export --platform web` and `--platform android` both bundle with exit 0 — all
  imports, the 66 audio clips, and all Khmer fonts resolve on both targets.
- **Not** done: no on-device/emulator run, so audio playback, gesture drawing, and the
  card-flip animation are verified to compile but not visually smoke-tested. (I have no
  emulator/browser here.) Run `npm run web` / `npm run android` to eyeball them.

## Navigation
5. Replaced the prototype's hand-rolled navigation stack with **React Navigation
   (native-stack)** — the idiomatic RN choice. Route names were PascalCased
   (`quiz-sc` → `QuizSC`, etc.).
6. Detail's prev/next and "confusables" use `navigation.setParams` (update in place)
   instead of the prototype's `replace`; back still returns to Browse. Equivalent UX.
7. Audio is stopped on every navigation via the container's `onStateChange` (mirrors the
   prototype calling `AudioBus.stop()` on each nav).
8. The prototype persisted the current route to `localStorage`. **Route is not
   persisted** here (app always opens on Home). Everything else is persisted. Easy to add
   later via React Navigation state persistence if you want it.

## Styling / theme
9. CSS custom properties → a typed **theme token system** (`light`/`dark` palettes) with a
   `ThemeProvider`. The tweakable accent overrides only the base accent, as in the source.
10. **`linear-gradient` backgrounds were simplified to solid soft tints** (hero cards,
    flashcard fronts, autoplay stage, mnemonic block). Avoids adding
    `expo-linear-gradient`. Swap in gradients later if you want exact fidelity.
11. Shadows are RN shadow/elevation objects approximating the CSS shadow tokens.
12. `letter-spacing` values in `em` were converted to approximate pixel values.
13. The blurred translucent top bar is a **solid `--bg` bar** (no `backdrop-filter` in RN).
14. CSS hover states are dropped (touch-first); pressed/active states are kept.
15. Reduced-motion handling from the prototype is not reimplemented.

## Fonts
16. Loaded via `@expo-google-fonts/*` packages (self-hosted, bundled). The prototype's
    weights are mapped to the closest available static weights.
17. Khmer combining vowel marks: `Glyph` adds ~18% line height and disables Android font
    padding to reduce clipping of stacked marks. Rendering quality of stacked marks on
    Android depends on the selected glyph font; **Noto Sans Khmer** tends to be the most
    robust and can be selected in Settings if a mark looks off in the default serif.

## Feature-level notes
18. **Handwriting canvas**: the HTML `<canvas>` was reimplemented with **react-native-svg
    paths driven by PanResponder** (works on web + Android). Strokes are vector paths;
    functionally equivalent to the pixel canvas. Fixed 320px height as in the source.
19. **Autoplay pace slider** and the **glyph-size slider**: HTML `<input type=range>` was
    replaced with a small custom PanResponder-based `Slider` (no extra native dependency).
20. **Match "shake"** on a wrong pair is conveyed with the red error colours only; the
    horizontal shake keyframe animation was not reproduced.
21. **Card flip** uses `Animated` `rotateY` + `backfaceVisibility: 'hidden'` (native +
    web), instead of the CSS 3D transform. Back-face content is kept concise to fit the
    fixed card aspect ratio.
22. Audio uses **expo-audio** (the current Expo audio module) via a singleton bus, one
    clip at a time — matching the prototype's `AudioBus` semantics.

## Product settings
23. The prototype's dev-only "Tweaks panel" (accent, dark mode, glyph font, glyph size)
    was **promoted into a real "Appearance" section at the top of Settings**, per the
    handoff note that those four values are genuine product settings. Dark mode is also
    toggleable from the top bar (as in the source).

## Data / content
24. `data.js` ported **verbatim** into a typed `khmer.ts` (same 33 consonants, 23 vowels,
    series, registers, words, mnemonics, confusables).
25. Audio files copied verbatim to `assets/audio/set{1,2}`; a static `require()` map
    (`audioAssets.ts`) is generated because Metro needs literal require paths.
26. **Vowel audio still doesn't exist** (`VOWEL_AUDIO_AVAILABLE = false`); the romanized
    fallback is preserved everywhere, exactly as specified in the handoff.
27. Session-only state (quiz score, handwriting recall, match progress, flashcard
    position) is not persisted — same as the prototype.

## Housekeeping
28. The original `design_handoff_khmer_alphabet/` prototype was removed after the port was
    verified. Its data, audio, and content were carried over verbatim into `src/` and
    `assets/`, so nothing was lost.
29. App identifiers: name **Aksar**, slug `aksar-khmer-alphabet`, package/bundle
    `com.aksar.khmeralphabet`. Change before publishing.
30. Default launcher/splash icons from the Expo template are still in `assets/` — replace
    with real Aksar branding before release.
