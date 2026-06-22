import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

export default function DeckScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>덱</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.sortButton}>
            <Ionicons name="swap-vertical" size={18} color={colors.text.secondary} />
          </Pressable>
          <Pressable style={styles.sortButton}>
            <Ionicons name="filter" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <Ionicons name="albums-outline" size={56} color={colors.text.muted} />
        </View>
        <Text style={styles.emptyTitle}>아직 카드가 없어요</Text>
        <Text style={styles.emptySubtitle}>측정해서 첫 카드를 만들어보세요</Text>
        <Pressable
          style={styles.emptyButton}
          onPress={() => router.push('/(tabs)/measure')}
        >
          <Ionicons name="flash" size={18} color={colors.button.primaryText} />
          <Text style={styles.emptyButtonText}>측정하러 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
})
