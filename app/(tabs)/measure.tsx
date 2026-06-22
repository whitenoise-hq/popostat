import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

export default function MeasureScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>전투력 측정</Text>
        <Text style={styles.subtitle}>우리 아이의 전투력은?</Text>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.photoArea}>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="paw" size={48} color={colors.text.muted} />
            <Text style={styles.photoHint}>사진을 선택해주세요</Text>
          </View>
          <View style={styles.photoButtons}>
            <Pressable style={styles.photoButton}>
              <Ionicons name="camera" size={20} color={colors.accent} />
              <Text style={styles.photoButtonText}>카메라</Text>
            </Pressable>
            <View style={styles.photoDivider} />
            <Pressable style={styles.photoButton}>
              <Ionicons name="images" size={20} color={colors.accent} />
              <Text style={styles.photoButtonText}>앨범</Text>
            </Pressable>
          </View>
        </Pressable>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>이름</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="pencil" size={16} color={colors.text.muted} />
            <Text style={styles.inputPlaceholder}>이름을 입력하세요</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {/* TODO: 사진+이름 입력 시 활성 버튼으로 전환 */}
        <Pressable style={styles.measureButton} onPress={() => router.push('/scan')}>
          <Ionicons name="flash" size={20} color={colors.button.primaryText} />
          <Text style={styles.measureButtonText}>전투력 측정</Text>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  photoArea: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  photoHint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  photoButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  },
  photoDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.input.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  inputPlaceholder: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.input.placeholder,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  measureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  measureButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
})
