import { useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { ShareableCard } from '../components/ShareableCard'
import { getMeasureState, clearMeasureState } from '../lib/measure-store'
import { shareCardImage } from '../lib/share'
import { colors } from '../theme/colors'
import { fonts } from '../theme/fonts'

export default function ResultScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { result, error } = getMeasureState()
  const [isSharing, setIsSharing] = useState(false)
  const cardRef = useRef<View>(null)

  // 에러 또는 데이터 없음
  if (error || !result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={56} color={colors.error} />
          <Text style={styles.errorTitle}>측정 실패</Text>
          <Text style={styles.errorMessage}>{error || '결과를 불러올 수 없습니다'}</Text>
          <Pressable
            style={styles.retryMainButton}
            onPress={() => {
              clearMeasureState()
              router.replace('/(tabs)/measure')
            }}
          >
            <Text style={styles.retryMainButtonText}>다시 시도하기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  function handleGoToDeck() {
    clearMeasureState()
    queryClient.invalidateQueries({ queryKey: ['cards'] })
    router.replace('/(tabs)/deck')
  }

  function handleRetry() {
    clearMeasureState()
    router.replace('/(tabs)/measure')
  }

  async function handleShare() {
    if (isSharing) return
    setIsSharing(true)
    try {
      await shareCardImage(cardRef)
    } catch (err) {
      Alert.alert('공유 실패', err instanceof Error ? err.message : '카드 공유에 실패했습니다')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ShareableCard ref={cardRef} card={result} />

        {result.analysis ? (
          <View style={styles.analysisCard}>
            <Ionicons name="chatbox-ellipses" size={16} color={colors.accent} />
            <Text style={styles.analysisText}>{result.analysis}</Text>
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={handleGoToDeck}>
            <Ionicons name="albums" size={18} color={colors.button.primaryText} />
            <Text style={styles.primaryButtonText}>덱에서 확인</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleShare} disabled={isSharing}>
            {isSharing ? (
              <ActivityIndicator size="small" color={colors.text.primary} />
            ) : (
              <>
                <Ionicons name="share-outline" size={18} color={colors.text.primary} />
                <Text style={styles.secondaryButtonText}>공유하기</Text>
              </>
            )}
          </Pressable>
        </View>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={16} color={colors.text.muted} />
          <Text style={styles.retryButtonText}>다시 측정하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  analysisCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  analysisText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.primary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.button.primaryText,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  retryButtonText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text.muted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },
  retryMainButton: {
    backgroundColor: colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  retryMainButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
})