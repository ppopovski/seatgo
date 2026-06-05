import Constants from 'expo-constants';
import { Platform } from 'react-native';

const key = (Constants.expoConfig?.extra?.googleMapsApiKey as string | undefined) ?? '';

export const GOOGLE_MAPS_API_KEY = key;

export const MAPS_ENABLED = Platform.OS !== 'android' || key.length > 0;
