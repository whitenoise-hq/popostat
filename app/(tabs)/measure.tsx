import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { setMeasureInput } from '../../lib/measure-store'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

export default function MeasureScreen() {
  const router = useRouter()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [petName, setPetName] = useState('')

  const isReady = imageUri !== null && petName.trim().length >= 1

  async function pickImage(source: 'camera' | 'library') {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options)

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }

  function handleMeasure() {
    if (!isReady || !imageUri) return
    setMeasureInput(imageUri, petName.trim())
    router.push('/scan')
  }

  function handleReset() {
    setImageUri(null)
    setPetName('')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>전투력 측정</Text>
          <Text style={styles.subtitle}>우리 아이의 전투력은?</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {imageUri ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Ionicons name="close-circle" size={28} color={colors.text.primary} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoArea}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="paw" size={48} color={colors.text.muted} />
                <Text style={styles.photoHint}>사진을 선택해주세요</Text>
              </View>
              <View style={styles.photoButtons}>
                <Pressable style={styles.photoButton} onPress={() => pickImage('camera')}>
                  <Ionicons name="camera" size={20} color={colors.accent} />
                  <Text style={styles.photoButtonText}>카메라</Text>
                </Pressable>
                <View style={styles.photoDivider} />
                <Pressable style={styles.photoButton} onPress={() => pickImage('library')}>
                  <Ionicons name="images" size={20} color={colors.accent} />
                  <Text style={styles.photoButtonText}>앨범</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름</Text>
            <View style={[styles.inputWrapper, petName.length > 0 && styles.inputWrapperFocus]}>
              <Ionicons name="pencil" size={16} color={petName.length > 0 ? colors.accent : colors.text.muted} />
              <TextInput
                style={styles.input}
                value={petName}
                onChangeText={setPetName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={colors.input.placeholder}
                maxLength={20}
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.measureButton, !isReady && styles.measureButtonDisabled]}
            onPress={handleMeasure}
            disabled={!isReady}
          >
            <Ionicons
              name="flash"
              size={20}
              color={isReady ? colors.button.primaryText : colors.button.disabledText}
            />
            <Text style={[styles.measureButtonText, !isReady && styles.measureButtonTextDisabled]}>
              전투력 측정
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
  photoPreview: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00000066',
    borderRadius: 14,
  },
  inputContainer: {
    gap: 8,
    marginTop: 10,
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
  inputWrapperFocus: {
    borderColor: colors.input.borderFocus,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text.primary,
    padding: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  measureButtonDisabled: {
    backgroundColor: colors.button.disabled,
  },
  measureButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
  measureButtonTextDisabled: {
    color: colors.button.disabledText,
  },
})