import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { CreateRecipeDTO } from '@/src/types/recipe'
import RecipePhotoPicker from '@/src/components/features/recipe/RecipePhotoPicker'
import PortionCounter from '@/src/components/features/recipe/PortionCounter'
import IngredientSearch from '@/src/components/features/recipe/IngredientSearch'
import StepList from '@/src/components/features/recipe/StepList'
import { createRecipe } from '@/src/services/recipes.service'
import { router } from 'expo-router'

function SectionTitle({ number, title }: { number: string; title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>{number}</Text>
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionLine} />
        </View>
    )
}

export default function CreateRecipeScreen() {
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

    const handleSave = async () => {
        if (!form.name) {
            Alert.alert('Erreur', 'Le nom de la recette est obligatoire')
            return
        }
        try {
            await createRecipe(form)
            Alert.alert('Succès', 'Recette créée !', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
            ])
        } catch (e: any) {
            Alert.alert('Erreur', e.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.headerEyebrow}>Nouvelle recette</Text>
                            <Text style={styles.headerTitle}>Créer{'\n'}une recette</Text>
                        </View>
                        <RecipePhotoPicker onPhotoChange={(uri) => setForm({ ...form, photoUri: uri })} />
                    </View>

                    {/* Section 1 — Infos de base */}
                    <SectionTitle number="01" title="Informations" />

                    <TextInput
                        style={styles.nameInput}
                        placeholder="Nom de la recette"
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                    />

                    <View style={styles.metaRow}>
                        <View style={styles.metaCard}>
                            <Text style={styles.metaLabel}>Personnes</Text>
                            <PortionCounter
                                value={form.portions}
                                onChange={(value) => setForm({ ...form, portions: value })}
                            />
                        </View>
                        <View style={styles.metaCard}>
                            <Text style={styles.metaLabel}>Préparation</Text>
                            <View style={styles.timeInput}>
                                <TextInput
                                    style={styles.timeTextInput}
                                    placeholder="0"
                                    placeholderTextColor={Colors.textSecondary}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setForm({ ...form, prepTime: parseInt(text) || 0 })}
                                />
                                <Text style={styles.timeUnit}>min</Text>
                            </View>
                        </View>
                        <View style={styles.metaCard}>
                            <Text style={styles.metaLabel}>Cuisson</Text>
                            <View style={styles.timeInput}>
                                <TextInput
                                    style={styles.timeTextInput}
                                    placeholder="0"
                                    placeholderTextColor={Colors.textSecondary}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setForm({ ...form, cookTime: parseInt(text) || 0 })}
                                />
                                <Text style={styles.timeUnit}>min</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 2 — Ingrédients */}
                    <SectionTitle number="02" title="Ingrédients" />
                    <IngredientSearch onChange={(ingredients) => setForm({ ...form, recipeIngredients: ingredients })} />

                    {/* Section 3 — Étapes */}
                    <SectionTitle number="03" title="Étapes" />
                    <StepList onChange={(steps) => setForm({ ...form, steps })} />

                    {/* Section 4 — Catégories */}
                    <SectionTitle number="04" title="Catégories" />
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Tags — à venir</Text>
                    </View>

                    {/* Section 5 — Description */}
                    <SectionTitle number="05" title="Description" />
                    <TextInput
                        style={styles.textarea}
                        placeholder="Une courte description de votre recette... (optionnel)"
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => setForm({ ...form, description: text })}
                    />

                    {/* Bouton */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
                        <Text style={styles.saveButtonText}>Enregistrer la recette</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    headerText: {
        flex: 1,
    },
    headerEyebrow: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.primaryLight,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        lineHeight: 40,
    },

    // Section headers
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    sectionNumber: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionNumberText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.surface,
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },

    // Nom
    nameInput: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        height: 56,
    },

    // Meta row (personnes, prep, cuisson)
    metaRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    metaCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.sm,
    },
    metaLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
    },
    timeTextInput: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.textPrimary,
    },
    timeUnit: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    // Textarea
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
        textAlignVertical: 'top',
    },

    // Placeholder
    placeholder: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        padding: Spacing.lg,
        alignItems: 'center',
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
    },

    // Save button
    saveButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    saveButtonText: {
        color: Colors.surface,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
    },
})