import { useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ShareableCard } from '../../components/ShareableCard'
import { AppModal } from '../../components/ui/AppModal'
import { useCard, useDeleteCard } from '../../hooks/useCards'
import { shareCardImage } from '../../lib/share'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

export default function CardDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: card, isLoading } = useCard(id ?? '')
  const deleteCard = useDeleteCard()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const cardRef = useRef<View>(null)

  async function handleShare() {
    if (isSharing) return
    setIsSharing(true)
    try {
      await shareCardImage(cardRef)
    } catch (error) {
      Alert.alert('공유 실패', error instanceof Error ? error.message : '카드 공유에 실패했습니다')
    } finally {
      setIsSharing(false)
    }
  }

  async function handleConfirmDelete() {
    if (!card) return
    try {
      setShowDeleteModal(false)
      await deleteCard.mutateAsync(card.id)
      router.back()
    } catch {
      Alert.alert('오류', '카드 삭제에 실패했습니다.')
    }
  }

  if (isLoading || !card) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>카드 상세</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIconButton} onPress={handleShare} disabled={isSharing}>
            {isSharing ? (
              <ActivityIndicator size="small" color={colors.text.primary} />
            ) : (
              <Ionicons name="share-outline" size={20} color={colors.text.primary} />
            )}
          </Pressable>
          <Pressable style={styles.headerIconButton} onPress={() => setShowDeleteModal(true)}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ShareableCard ref={cardRef} card={card} />

        {card.analysis ? (
          <View style={styles.analysisCard}>
            <Ionicons name="chatbox-ellipses" size={16} color={colors.accent} />
            <Text style={styles.analysisText}>{card.analysis}</Text>
          </View>
        ) : null}

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>측정일</Text>
            <Text style={styles.metaValue}>
              {new Date(card.created_at).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>종류</Text>
            <Text style={styles.metaValue}>{card.detected}</Text>
          </View>
          {card.name_guess ? (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>품종</Text>
                <Text style={styles.metaValue}>{card.name_guess}</Text>
              </View>
            </>
          ) : null}
        </View>

      </ScrollView>

      <AppModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        icon="alert-circle"
        iconColor={colors.error}
        title="카드를 삭제할까요?"
        message="삭제된 카드는 복구할 수 없어요."
        buttons={[
          { label: '취소', onPress: () => setShowDeleteModal(false), variant: 'secondary' },
          { label: '삭제', onPress: handleConfirmDelete, variant: 'danger' },
        ]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
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
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text.muted,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 14,
  },
})