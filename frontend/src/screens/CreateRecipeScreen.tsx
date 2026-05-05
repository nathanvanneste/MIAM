import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, Image, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { ImagePlus, Clock, Users, Mic } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { CreateRecipeDTO } from '@/src/types/recipe'
import PortionCounter from '@/src/components/features/recipe/PortionCounter'
import IngredientSearch from '@/src/components/features/recipe/IngredientSearch'
import StepList from '@/src/components/features/recipe/StepList'
import { createRecipe } from '@/src/services/recipes.service'
import { router, useLocalSearchParams } from 'expo-router'

function SectionTitle({ number, title }: { number: string; title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{number}</Text>
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionLine} />
        </View>
    )
}

export default function CreateRecipeScreen() {
    const { prefill } = useLocalSearchParams<{ prefill?: string }>();
    
    const [form, setForm] = useState<CreateRecipeDTO>({
        name: '',
        portions: 2,
        prepTime: 0,
        cookTime: 0,
        recipeIngredients: [],
        categories: [],
        steps: [],
        description: undefined,
        photoUri: undefined,
    })
    const [coverUri, setCoverUri] = useState<string | null>(null)

    // Préremplir les données si elles viennent de la dictée vocale
    useEffect(() => {
        if (prefill) {
            try {
                const prefillData = JSON.parse(decodeURIComponent(prefill));
                console.log('📝 Préremplissage des données:', prefillData);
                
                setForm(prevForm => ({
                    ...prevForm,
                    ...prefillData,
                    // S'assurer que les tableaux sont bien formatés
                    recipeIngredients: prefillData.recipeIngredients || [],
                    steps: prefillData.steps || [],
                    categories: prefillData.categories || [],
                }));
            } catch (error) {
                console.error('Erreur lors du parsing des données préremplies:', error);
            }
        }
    }, [prefill]);

    const pickCover = () => {
        Alert.alert('Photo de couverture', undefined, [
            {
                text: 'Prendre une photo',
                onPress: async () => {
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [16, 9], quality: 0.8 })
                    if (!result.canceled) saveCover(result.assets[0].uri)
                },
            },
            {
                text: 'Choisir depuis la galerie',
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.8 })
                    if (!result.canceled) saveCover(result.assets[0].uri)
                },
            },
            { text: 'Annuler', style: 'cancel' },
        ])
    }

    const saveCover = async (uri: string) => {
        const fileName = uri.split('/').pop() ?? `cover-${Date.now()}.jpg`
        const stableUri = `${FileSystem.documentDirectory}${Date.now()}-${fileName}`
        await FileSystem.copyAsync({ from: uri, to: stableUri })
        setCoverUri(stableUri)
        setForm(f => ({ ...f, photoUri: stableUri }))
    }

    const handleSave = async () => {
        if (!form.name.trim()) {
            Alert.alert('Erreur', 'Le nom de la recette est obligatoire')
            return
        }
        try {
            await createRecipe(form)
            Alert.alert('Succès', 'Recette créée !', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/profile') },
            ])
        } catch (e: any) {
            Alert.alert('Erreur', e.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cover photo — pleine largeur */}
                    <TouchableOpacity style={styles.cover} onPress={pickCover} activeOpacity={0.85}>
                        {coverUri ? (
                            <Image source={{ uri: coverUri }} style={styles.coverImage} />
                        ) : (
                            <View style={styles.coverPlaceholder}>
                                <ImagePlus size={36} color={Colors.primaryMuted} />
                                <Text style={styles.coverPlaceholderText}>Ajouter une photo de couverture</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Bloc titre */}
                    <View style={styles.titleBlock}>
                        <Text style={styles.eyebrow}>Nouvelle recette</Text>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Nom de la recette..."
                            placeholderTextColor={Colors.textSecondary}
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                            multiline={false}
                        />
                    </View>

                    <View style={styles.content}>

                        {/* 01 — Informations */}
                        <SectionTitle number="01" title="Informations" />
                        <View style={styles.metaRow}>
                            <View style={[styles.metaCard, { flex: 1.3 }]}>
                                <View style={styles.metaLabelRow}>
                                    <Users size={11} color={Colors.primaryMuted} />
                                    <Text style={styles.metaLabel}>Personnes</Text>
                                </View>
                                <PortionCounter
                                    value={form.portions}
                                    onChange={(value) => setForm({ ...form, portions: value })}
                                />
                            </View>
                            <View style={styles.metaCard}>
                                <View style={styles.metaLabelRow}>
                                    <Clock size={11} color={Colors.primaryMuted} />
                                    <Text style={styles.metaLabel}>Prép.</Text>
                                </View>
                                <View style={styles.timeRow}>
                                    <TextInput
                                        style={styles.timeInput}
                                        placeholder="0"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={form.prepTime > 0 ? String(form.prepTime) : ''}
                                        keyboardType="numeric"
                                        onChangeText={(text) => setForm({ ...form, prepTime: parseInt(text) || 0 })}
                                        multiline={false}
                                    />
                                    <Text style={styles.timeUnit}>min</Text>
                                </View>
                            </View>
                            <View style={styles.metaCard}>
                                <View style={styles.metaLabelRow}>
                                    <Clock size={11} color={Colors.primaryMuted} />
                                    <Text style={styles.metaLabel}>Cuisson</Text>
                                </View>
                                <View style={styles.timeRow}>
                                    <TextInput
                                        style={styles.timeInput}
                                        placeholder="0"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={form.cookTime > 0 ? String(form.cookTime) : ''}
                                        keyboardType="numeric"
                                        onChangeText={(text) => setForm({ ...form, cookTime: parseInt(text) || 0 })}
                                        multiline={false}
                                    />
                                    <Text style={styles.timeUnit}>min</Text>
                                </View>
                            </View>
                        </View>

                        {/* 02 — Ingrédients */}
                        <SectionTitle number="02" title="Ingrédients" />
                        <IngredientSearch
                            initialIngredients={form.recipeIngredients}
                            onChange={(ingredients) => setForm({ ...form, recipeIngredients: ingredients })}
                        />

                        {/* 03 — Étapes */}
                        <SectionTitle number="03" title="Étapes" />
                        <StepList
                            initialSteps={form.steps}
                            onChange={(steps) => setForm({ ...form, steps })}
                        />

                        {/* 04 — Catégories */}
                        <SectionTitle number="04" title="Catégories" />
                        <View style={styles.comingSoon}>
                            <Text style={styles.comingSoonText}>Tags — à venir</Text>
                        </View>

                        {/* 05 — Description */}
                        <SectionTitle number="05" title="Description" />
                        <TextInput
                            style={styles.textarea}
                            placeholder="Une courte description... (optionnel)"
                            placeholderTextColor={Colors.textSecondary}
                            multiline
                            numberOfLines={4}
                            value={form.description ?? ''}
                            onChangeText={(text) => setForm({ ...form, description: text })}
                            textAlignVertical="top"
                        />

                        {/* Bouton */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
                            <Text style={styles.saveButtonText}>Enregistrer la recette</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            
            {/* Floating Voice Button */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => router.push('/voice-chat')}
                activeOpacity={0.8}
            >
                <Mic size={28} color={Colors.surface} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const COVER_HEIGHT = 220

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { flexGrow: 1, paddingBottom: Spacing.xxxl },

    // Cover
    cover: { height: COVER_HEIGHT, width: '100%', overflow: 'hidden' },
    coverImage: { width: '100%', height: COVER_HEIGHT, resizeMode: 'cover' },
    coverPlaceholder: {
        flex: 1,
        backgroundColor: Colors.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    coverPlaceholderText: {
        fontSize: FontSize.sm,
        color: Colors.primaryMuted,
        fontWeight: FontWeight.medium,
    },

    // Titre
    titleBlock: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    eyebrow: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.primaryLight,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
    },
    nameInput: {
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        padding: 0,
    },

    // Contenu
    content: { paddingHorizontal: Spacing.xl },

    // Section headers
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    sectionBadge: {
        width: 26,
        height: 26,
        borderRadius: 7,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionBadgeText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    sectionLine: { flex: 1, height: 1, backgroundColor: Colors.border },

    // Meta cards
    metaRow: { flexDirection: 'row', gap: Spacing.sm },
    metaCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
    },
    metaLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    metaLabel: {
        fontSize: 10,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeRow: { flexDirection: 'row', alignItems: 'center', height: 36 },
    timeInput: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        padding: 0,
    },
    timeUnit: { fontSize: FontSize.xs, color: Colors.textSecondary },

    // Description
    textarea: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        minHeight: 100,
    },

    // Categories placeholder
    comingSoon: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        padding: Spacing.lg,
        alignItems: 'center',
    },
    comingSoonText: { color: Colors.textSecondary, fontSize: FontSize.sm },

    // Save button
    saveButton: {
        height: ComponentSize.buttonHeight,
        backgroundColor: Colors.primaryButton,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    saveButtonText: {
        color: Colors.primary,
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
    },

    // Floating Voice Button
    fab: {
        position: 'absolute',
        bottom: Spacing.lg,
        right: Spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primaryButton,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primaryButton,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
})
