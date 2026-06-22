import { useState, useMemo } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCards } from '../../hooks/useCards'
import { getImageUrl } from '../../lib/storage'
import { colors, gradeColors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'
import type { Card, Grade } from '../../types/card'
import { Image } from 'react-native'

type SortOption = 'latest' | 'power' | 'grade'
type FilterGrade = Grade | 'all'

const SORT_LABELS: Record<SortOption, string> = {
  latest: '최신순',
  power: '전투력순',
  grade: '등급순',
}

const GRADE_ORDER: Record<Grade, number> = {
  F: 0, D: 1, C: 2, B: 3, A: 4, S: 5, SS: 6, SSS: 7,
}

function MiniCard({ card, onPress }: { card: Card; onPress: () => void }) {
  const grade = gradeColors[card.grade]
  const imageUri = card.image_url
    ? (card.image_url.startsWith('http') ? card.image_url : getImageUrl(card.image_url))
    : null

  return (
    <Pressable style={styles.miniCard} onPress={onPress}>
      <View style={[styles.miniImageArea, { borderColor: `${grade.primary}44` }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.miniImage} />
        ) : (
          <Ionicons name="paw" size={28} color={grade.primary} />
        )}
      </View>
      <View style={styles.miniInfo}>
        <View style={styles.miniTopRow}>
          <Text style={styles.miniName} numberOfLines={1}>{card.pet_name}</Text>
          <View style={[styles.miniGradeBadge, { backgroundColor: grade.primary }]}>
            <Text style={styles.miniGradeText}>{card.grade}</Text>
          </View>
        </View>
        <Text style={styles.miniTitle} numberOfLines={1}>{card.title}</Text>
        <View style={styles.miniPowerRow}>
          <Ionicons name="flash" size={11} color={grade.primary} />
          <Text style={[styles.miniPower, { color: grade.primary }]}>
            {card.power.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default function DeckScreen() {
  const router = useRouter()
  const { data: cards, isLoading } = useCards()
  const [sort, setSort] = useState<SortOption>('latest')
  const [filterGrade, setFilterGrade] = useState<FilterGrade>('all')
  const [showSort, setShowSort] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const sortedCards = useMemo(() => {
    if (!cards) return []

    let filtered = filterGrade === 'all'
      ? cards
      : cards.filter((c) => c.grade === filterGrade)

    return [...filtered].sort((a, b) => {
      if (sort === 'power') return b.power - a.power
      if (sort === 'grade') return GRADE_ORDER[b.grade] - GRADE_ORDER[a.grade]
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [cards, sort, filterGrade])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>덱</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>덱</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.chipButton, showSort && styles.chipButtonActive]}
            onPress={() => { setShowSort(!showSort); setShowFilter(false) }}
          >
            <Ionicons name="swap-vertical" size={14} color={showSort ? colors.accent : colors.text.secondary} />
            <Text style={[styles.chipText, showSort && styles.chipTextActive]}>
              {SORT_LABELS[sort]}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.chipButton, showFilter && styles.chipButtonActive]}
            onPress={() => { setShowFilter(!showFilter); setShowSort(false) }}
          >
            <Ionicons name="filter" size={14} color={showFilter ? colors.accent : colors.text.secondary} />
            <Text style={[styles.chipText, showFilter && styles.chipTextActive]}>
              {filterGrade === 'all' ? '전체' : filterGrade}
            </Text>
          </Pressable>
        </View>
      </View>

      {showSort && (
        <View style={styles.optionRow}>
          {(['latest', 'power', 'grade'] as SortOption[]).map((s) => (
            <Pressable
              key={s}
              style={[styles.optionChip, sort === s && styles.optionChipActive]}
              onPress={() => { setSort(s); setShowSort(false) }}
            >
              <Text style={[styles.optionChipText, sort === s && styles.optionChipTextActive]}>
                {SORT_LABELS[s]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {showFilter && (
        <View style={styles.optionRow}>
          <Pressable
            style={[styles.optionChip, filterGrade === 'all' && styles.optionChipActive]}
            onPress={() => { setFilterGrade('all'); setShowFilter(false) }}
          >
            <Text style={[styles.optionChipText, filterGrade === 'all' && styles.optionChipTextActive]}>전체</Text>
          </Pressable>
          {(['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'F'] as Grade[]).map((g) => (
            <Pressable
              key={g}
              style={[styles.optionChip, filterGrade === g && styles.optionChipActive]}
              onPress={() => { setFilterGrade(g); setShowFilter(false) }}
            >
              <Text style={[styles.optionChipText, filterGrade === g && styles.optionChipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.cardCount}>{sortedCards.length}장의 카드</Text>

      <FlatList
        data={sortedCards}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MiniCard
            card={item}
            onPress={() => router.push(`/card/${item.id}`)}
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipButtonActive: {
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.accent,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 6,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionChipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text.secondary,
  },
  optionChipTextActive: {
    color: colors.button.primaryText,
  },
  cardCount: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text.muted,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  miniCard: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  miniImageArea: {
    aspectRatio: 1.3,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  miniImage: {
    width: '100%',
    height: '100%',
  },
  miniInfo: {
    padding: 10,
    gap: 4,
  },
  miniTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    flex: 1,
  },
  miniGradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 6,
  },
  miniGradeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.text.inverse,
  },
  miniTitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  miniPowerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  miniPower: {
    fontSize: 12,
    fontFamily: fonts.bold,
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