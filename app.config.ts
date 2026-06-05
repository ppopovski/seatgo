import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return {
    ...config,
    name: 'SeatGo',
    slug: 'SeatGo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'seatgo',
    userInterfaceStyle: 'automatic',
    ios: {
      icon: './assets/expo.icon',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'SeatGo uses your location to show nearby buses, trains, and taxis.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#FFFFFF',
        foregroundImage: './assets/splash-icon.png',
      },
      predictiveBackGestureEnabled: false,
      package: 'com.anonymous.SeatGo',
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    },
    web: {
      output: 'static',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#FFFFFF',
          image: './assets/splash-icon.png',
          imageWidth: 120,
          android: {
            image: './assets/splash-icon.png',
            imageWidth: 120,
          },
        },
      ],
      [
        'react-native-maps',
        {
          androidGoogleMapsApiKey: googleMapsApiKey,
          iosGoogleMapsApiKey: googleMapsApiKey || undefined,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...config.extra,
      googleMapsApiKey,
    },
  };
};
