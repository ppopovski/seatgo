import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HomeTopBarProps = {
  userName?: string | null;
  onSearchPress?: () => void;
};

export function HomeTopBar({ userName, onSearchPress }: HomeTopBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const initial = (userName?.charAt(0) ?? 'G').toUpperCase();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onSearchPress}
        style={({ pressed }) => [
          styles.actionCircle,
          { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Ionicons name="add" size={22} color={theme.primaryForeground} />
      </Pressable>

      <View style={styles.right}>
        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.avatar,
            { backgroundColor: theme.accentSoft, opacity: pressed ? 0.85 : 1 },
          ]}>
          <ThemedText style={styles.avatarText}>{initial}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.bold,
  },
});
