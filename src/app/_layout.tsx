import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, StyleSheet } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts, Quicksand_300Light, Quicksand_400Regular } from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen';

import { AuthGateProvider, useAuthGate } from '@/components/providers/AuthGateProvider';
import { SignInModal } from '@/components/ui/SignInModal';
import { Colors, NavHeaderTitleStyle } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.headerBackground,
    text: Colors.light.headerForeground,
    border: Colors.light.border,
    primary: Colors.light.headerForeground,
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.headerBackground,
    text: Colors.dark.headerForeground,
    border: Colors.dark.border,
    primary: Colors.dark.headerForeground,
  },
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { signInModalVisible, hideSignInModal } = useAuthGate();
  const isDark = colorScheme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkNavTheme : LightNavTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
          },
        }}
        initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/sign-in"
          options={{
            headerShown: true,
            title: 'Sign in',
            headerStyle: { backgroundColor: isDark ? Colors.dark.headerBackground : Colors.light.headerBackground },
            headerTintColor: isDark ? Colors.dark.headerForeground : Colors.light.headerForeground,
            headerTitleStyle: NavHeaderTitleStyle,
          }}
        />
        <Stack.Screen
          name="home/search"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Where to?',
            headerStyle: { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface },
            headerTintColor: isDark ? Colors.dark.text : Colors.light.text,
            headerTitleStyle: NavHeaderTitleStyle,
          }}
        />
        <Stack.Screen
          name="home/route/[id]"
          options={{
            headerShown: true,
            title: 'Route details',
            headerStyle: { backgroundColor: isDark ? Colors.dark.headerBackground : Colors.light.headerBackground },
            headerTintColor: isDark ? Colors.dark.headerForeground : Colors.light.headerForeground,
            headerTitleStyle: NavHeaderTitleStyle,
          }}
        />
        <Stack.Screen
          name="home/stop/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home/taxi"
          options={{
            headerShown: true,
            title: 'Book taxi',
            headerStyle: { backgroundColor: isDark ? Colors.dark.headerBackground : Colors.light.headerBackground },
            headerTintColor: isDark ? Colors.dark.headerForeground : Colors.light.headerForeground,
            headerTitleStyle: NavHeaderTitleStyle,
          }}
        />
        <Stack.Screen
          name="tickets/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="wallet/top-up"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
      <SignInModal
        visible={signInModalVisible}
        onClose={hideSignInModal}
        onSignIn={() => {
          hideSignInModal();
          router.push('/auth/sign-in');
        }}
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Quicksand_400Regular, Quicksand_300Light });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <BottomSheetModalProvider>
        <AuthGateProvider>
          <RootNavigator />
        </AuthGateProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
