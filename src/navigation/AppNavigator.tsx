import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AudioBus } from '../audio/AudioBus';
import { useTheme } from '../theme/ThemeContext';
import { AutoplayScreen } from '../screens/AutoplayScreen';
import { BrowseScreen } from '../screens/BrowseScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { FlashcardsScreen } from '../screens/FlashcardsScreen';
import { HandwritingScreen } from '../screens/HandwritingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MatchScreen } from '../screens/MatchScreen';
import { QuizCSScreen } from '../screens/QuizCSScreen';
import { QuizSCScreen } from '../screens/QuizSCScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TopBar } from './TopBar';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { c, dark } = useTheme();
  const navTheme = {
    dark,
    colors: {
      primary: c.accent,
      background: c.bg,
      card: c.bg,
      text: c.ink,
      border: c.line,
      notification: c.accent,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '800' as const },
    },
  };

  return (
    <NavigationContainer theme={navTheme} onStateChange={() => AudioBus.stop()}>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <TopBar {...props} />,
          contentStyle: { backgroundColor: c.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Browse" component={BrowseScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="QuizSC" component={QuizSCScreen} />
        <Stack.Screen name="QuizCS" component={QuizCSScreen} />
        <Stack.Screen name="Handwriting" component={HandwritingScreen} />
        <Stack.Screen name="Match" component={MatchScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="Autoplay" component={AutoplayScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
