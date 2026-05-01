import { useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera, ImagePlus } from 'lucide-react-native'
import { Colors, BorderRadius } from '@/src/constants'

type Props = {
  onPhotoChange: (uri: string) => void
}

export default function RecipePhotoPicker({ onPhotoChange }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null)

  const pickPhoto = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setPhotoUri(uri)
      onPhotoChange(uri)
    }
  }

  const handlePress = () => {
    Alert.alert(
      'Ajouter une photo',
      undefined,
      [
        { text: 'Prendre une photo', onPress: () => pickPhoto(true) },
        { text: 'Choisir depuis la galerie', onPress: () => pickPhoto(false) },
        { text: 'Annuler', style: 'cancel' },
      ]
    )
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <ImagePlus size={28} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.cameraButton}>
        <Camera size={14} color={Colors.surface} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})