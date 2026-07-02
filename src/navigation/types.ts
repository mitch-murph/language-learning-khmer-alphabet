import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Browse: undefined;
  Detail: { glyph: string };
  QuizSC: undefined;
  QuizCS: undefined;
  Handwriting: undefined;
  Match: undefined;
  Flashcards: undefined;
  Autoplay: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export const TITLES: Partial<Record<keyof RootStackParamList, string>> = {
  Browse: 'Browse',
  QuizSC: 'Sound → Character',
  QuizCS: 'Character → Sound',
  Handwriting: 'Handwriting',
  Match: 'Match',
  Flashcards: 'Flashcards',
  Autoplay: 'Hands-free',
  Settings: 'Settings',
};
