import { View, Text, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { Card } from '../types/card'
import { fonts } from '../theme/fonts'

const DARK_GRADE_COLORS = {
  F:   { primary: '#6B7280', glow: '#6B728044', gradient: ['#2A2B3D', '#1E1F35'] as const },
  D:   { primary: '#2DD4BF', glow: '#2DD4BF44', gradient: ['#1A2F2E', '#1E1F35'] as const },
  C:   { primary: '#60A5FA', glow: '#60A5FA44', gradient: ['#1A2540', '#1E1F35'] as const },
  B:   { primary: '#C084FC', glow: '#C084FC44', gradient: ['#2A1F40', '#1E1F35'] as const },
  A:   { primary: '#FB923C', glow: '#FB923C44', gradient: ['#3A2520', '#1E1F35'] as const },
  S:   { primary: '#FBBF24', glow: '#FBBF2466', gradient: ['#3A3520', '#1E1F35'] as const },
  SS:  { primary: '#F472B6', glow: '#F472B666', gradient: ['#3A1F30', '#1E1F35'] as const },
  SSS: { primary: '#F59E0B', glow: '#F59E0B88', gradient: ['#3A2A10', '#1E1F35'] as const },
} as const

type StatBarProps = {
  label: string
  value: number
  color: string
  icon: keyof typeof Ionicons.glyphMap
}

function StatBar({ label, value, color, icon }: StatBarProps) {
  return (
    <View style={darkStyles.statRow}>
      <Ionicons name={icon} size={14} color={color} style={darkStyles.statIcon} />
      <Text style={darkStyles.statLabel}>{label}</Text>
      <View style={darkStyles.statBarBg}>
        <LinearGradient
          colors={[color, `${color}88`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[darkStyles.statBarFill, { width: `${value}%` }]}
        />
      </View>
      <Text style={[darkStyles.statValue, { color }]}>{value}</Text>
    </View>
  )
}

type Props = {
  card: Card
}

export function BattleCardDark({ card }: Props) {
  const gradeColor = DARK_GRADE_COLORS[card.grade]

  return (
    <View style={[darkStyles.cardOuter, { shadowColor: gradeColor.glow }]}>
      <LinearGradient
        colors={gradeColor.gradient}
        style={darkStyles.card}
      >
        <View style={darkStyles.header}>
          <Text style={darkStyles.petName}>{card.petName}</Text>
          <View style={[darkStyles.gradeBadge, { backgroundColor: gradeColor.primary }]}>
            <Text style={darkStyles.gradeText}>{card.grade}</Text>
          </View>
        </View>

        <View style={[darkStyles.imageContainer, { borderColor: `${gradeColor.primary}66` }]}>
          {card.imageUrl ? (
            <Image source={{ uri: card.imageUrl }} style={darkStyles.petImage} />
          ) : (
            <View style={darkStyles.imagePlaceholder}>
              <Ionicons name="paw" size={48} color={gradeColor.primary} />
            </View>
          )}
          <View style={darkStyles.powerBadge}>
            <Ionicons name="flash" size={12} color={gradeColor.primary} />
            <Text style={[darkStyles.powerText, { color: gradeColor.primary }]}>
              {card.power.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={darkStyles.infoRow}>
          <Text style={darkStyles.title}>{card.title}</Text>
          <Text style={darkStyles.nameGuess}>{card.nameGuess}</Text>
        </View>

        <View style={darkStyles.statsContainer}>
          <StatBar label="공격" value={card.stats.attack} color="#EF4444" icon="flame" />
          <StatBar label="방어" value={card.stats.defense} color="#3B82F6" icon="shield" />
          <StatBar label="민첩" value={card.stats.agility} color="#22C55E" icon="speedometer" />
          <StatBar label="귀여움" value={card.stats.cuteness} color="#EC4899" icon="heart" />
          <StatBar label="게으름" value={card.stats.laziness} color="#8B5CF6" icon="moon" />
        </View>

        <View style={darkStyles.moveContainer}>
          <Ionicons name="sparkles" size={14} color={gradeColor.primary} />
          <Text style={darkStyles.moveText}>{card.specialMove}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}

const darkStyles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2B4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: '#E8E8F0',
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#0F0F1A',
  },
  imageContainer: {
    aspectRatio: 1.2,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#12132A',
    borderWidth: 1,
    marginBottom: 12,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F1Acc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  powerText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#A0A0C0',
  },
  nameGuess: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: '#6B6B8D',
  },
  statsContainer: {
    gap: 6,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 14,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: '#8B8BA8',
    width: 40,
  },
  statBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#12132A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    fontSize: 12,
    fontFamily: fonts.bold,
    width: 28,
    textAlign: 'right',
  },
  moveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#12132A',
    padding: 10,
    borderRadius: 10,
  },
  moveText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: '#A0A0C0',
    flex: 1,
  },
})