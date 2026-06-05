import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';

export default function RootIndex() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);

  if (!hydrated) {
    return null;
  }

  if (!hasOnboarded) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
