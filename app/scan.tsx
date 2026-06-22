import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { measurePet } from '../lib/measure'
import { getMeasureState, setMeasureResult, setMeasureError } from '../lib/measure-store'
import { colors } from '../theme/colors'
import { fonts } from '../theme/fonts'

const SCAN_MESSAGES = [
  '전투력 분석 중...',
  '스탯 판독 중...',
  '특수 능력 감지 중...',
  '등급 산정 중...',
]

const STAT_LABELS = ['공격', '방어', '민첩', '귀여움', '게으름']

function useFlickerStats() {
  const [stats, setStats] = useState(STAT_LABELS.map(() => Math.floor(Math.random() * 100)))

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(STAT_LABELS.map(() => Math.floor(Math.random() * 100)))
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return stats
}

function useRotatingMessage() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SCAN_MESSAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return SCAN_MESSAGES[index]
}

export default function ScanScreen() {
  const router = useRouter()
  const scanLineY = useSharedValue(0)
  const glowOpacity = useSharedValue(0.4)
  const progressWidth = useSharedValue(0)
  const flickerStats = useFlickerStats()
  const message = useRotatingMessage()
  const [apiDone, setApiDone] = useState(false)
  const minTimePassed = useSharedValue(false)

  function navigateToResult() {
    router.replace('/result')
  }

  // 최소 3초 대기 후 minTimePassed = true
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimePassed.value = true
      // API가 이미 끝났으면 바로 완료 애니메이션
      if (apiDone) {
        progressWidth.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(navigateToResult)()
        })
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [apiDone])

  // 실제 API 호출
  useEffect(() => {
    const { imageUri, petName } = getMeasureState()
    if (!imageUri || !petName) {
      setMeasureError('사진과 이름이 필요합니다')
      setApiDone(true)
      return
    }

    measurePet(imageUri, petName)
      .then((card) => {
        setMeasureResult(card)
        setApiDone(true)
      })
      .catch((err) => {
        setMeasureError(err instanceof Error ? err.message : '측정에 실패했습니다')
        setApiDone(true)
      })
  }, [])

  // apiDone이 되었고 최소 시간도 지났으면 완료 애니메이션
  useEffect(() => {
    if (apiDone && minTimePassed.value) {
      progressWidth.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }, () => {
        runOnJS(navigateToResult)()
      })
    }
  }, [apiDone])

  // 스캔라인 + glow 애니메이션
  useEffect(() => {
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    )

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
    )

    // 0→80% 빠르게 (3초), 80→95% 천천히 (이후)
    progressWidth.value = withSequence(
      withTiming(0.8, { duration: 3000, easing: Easing.out(Easing.ease) }),
      withTiming(0.95, { duration: 5000, easing: Easing.linear }),
    )
  }, [scanLineY, glowOpacity, progressWidth])

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${scanLineY.value * 100}%` as unknown as number,
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as unknown as number,
  }))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>전투력 측정</Text>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.scanFrame, glowStyle]}>
          <View style={styles.imageArea}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="flash" size={64} color={colors.accent} />
            </View>

            <Animated.View style={[styles.scanLine, scanLineStyle]}>
              <LinearGradient
                colors={['transparent', `${colors.accent}66`, `${colors.accent}cc`, `${colors.accent}66`, 'transparent']}
                style={styles.scanLineGradient}
              />
            </Animated.View>

            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </Animated.View>

        <View style={styles.statsReadout}>
          {STAT_LABELS.map((label, i) => (
            <View key={label} style={styles.statRow}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{flickerStats[i]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.messageArea}>
          <Ionicons name="scan" size={18} color={colors.accent} />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, progressStyle]}>
            <LinearGradient
              colors={[colors.accent, '#A78BFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const CORNER_SIZE = 20
const CORNER_WIDTH = 3

const cornerBase = {
  position: 'absolute' as const,
  width: CORNER_SIZE,
  height: CORNER_SIZE,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 28,
  },
  scanFrame: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 2,
  },
  imageArea: {
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: colors.card,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    opacity: 0.3,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
  },
  scanLineGradient: {
    flex: 1,
  },
  cornerTL: {
    ...cornerBase,
    top: 12,
    left: 12,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.accent,
  },
  cornerTR: {
    ...cornerBase,
    top: 12,
    right: 12,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.accent,
  },
  cornerBL: {
    ...cornerBase,
    bottom: 12,
    left: 12,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.accent,
  },
  cornerBR: {
    ...cornerBase,
    bottom: 12,
    right: 12,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.accent,
  },
  statsReadout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statRow: {
    alignItems: 'center',
    width: 52,
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.accent,
    width: 32,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  messageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text.secondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
})