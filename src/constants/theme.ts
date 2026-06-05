import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#0A0A0A',
    background: '#F7F7F8',
    backgroundElement: '#EBEBED',
    backgroundSelected: '#DCDCE0',
    textSecondary: '#5C5C66',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E4E4E7',
    textMuted: '#9A9AA3',
    primary: '#0A0A0A',
    primaryForeground: '#FFFFFF',
    disabled: '#BDBDBD',
    headerBackground: '#0A0A0A',
    headerForeground: '#FFFFFF',
    headerMuted: '#A8A8B0',
    accentSoft: '#F0F0F2',
    success: '#2A2A2A',
  },
  dark: {
    text: '#F5F5F5',
    background: '#0A0A0A',
    backgroundElement: '#1C1C1E',
    backgroundSelected: '#2C2C2E',
    textSecondary: '#A8A8B0',
    surface: '#141414',
    surfaceElevated: '#1E1E1E',
    border: '#2E2E32',
    textMuted: '#6E6E76',
    primary: '#FFFFFF',
    primaryForeground: '#0A0A0A',
    disabled: '#4A4A4E',
    headerBackground: '#141414',
    headerForeground: '#FFFFFF',
    headerMuted: '#8E8E96',
    accentSoft: '#1C1C1E',
    success: '#E5E5E5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Tokens = {
  radius: { sm: 10, md: 14, lg: 20, xl: 28, xxl: 32, pill: 999 },
  fontSize: {
    display: 36,
    heading: 28,
    title: 20,
    body: 16,
    caption: 13,
    micro: 11,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  motion: {
    sheetDuration: 300,
    pressScale: 0.98,
    markerFadeDuration: 250,
  },
};

export const Shadows = {
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 8 },
    default: {},
  }),
};

export const FontFamily = {
  regular: Platform.select({
    web: 'Quicksand',
    default: 'Quicksand_400Regular',
  }) as string,
  light: Platform.select({
    web: 'Quicksand',
    default: 'Quicksand_300Light',
  }) as string,
};

export const NavHeaderTitleStyle = {
  fontFamily: FontFamily.regular,
  fontWeight: '400' as const,
};

export const Fonts = {
  sans: FontFamily.regular,
  regular: FontFamily.regular,
  serif: Platform.select({
    ios: 'ui-serif',
    default: 'serif',
    web: 'var(--font-serif)',
  }),
  rounded: FontFamily.regular,
  mono: Platform.select({
    ios: 'ui-monospace',
    default: 'monospace',
    web: 'var(--font-mono)',
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
