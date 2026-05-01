import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { CreateRecipeDTO } from '@/src/types/recipe'
import RecipePhotoPicker from '@/src/components/features/recipe/RecipePhotoPicker'
import PortionCounter from '@/src/components/features/recipe/PortionCounter'
import IngredientSearch from '@/src/components/features/recipe/IngredientSearch'

export default function CreateRecipeScreen() {
    const [form, setForm] = useState<CreateRecipeDTO>({
        name: '',
        portions: 2,
        prepTime: 0,
        cookTime: 0,
        recipeIngredients: [],
        categories: [],
        description: undefined,
        photoUri: undefined,
    })

    const handleSave = async () => {
        // à brancher sur le service plus tard
        console.log(form)
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Créer une recette</Text>
                            <Text style={styles.subtitle}>Remplissez les informations de votre recette</Text>
                        </View>
                        <RecipePhotoPicker onPhotoChange={(uri) => setForm({ ...form, photoUri: uri })} />
                    </View>

                    {/* Nom */}
                    <Text style={styles.label}>Nom de la recette</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Tarte aux pommes"
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                    />

                    {/* Portions + Temps */}
                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Text style={styles.label}>Personnes</Text>
                            <PortionCounter
                                value={form.portions}
                                onChange={(value) => setForm({ ...form, portions: value })}
                            />
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.label}>Temps de préparation (min)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="30"
                                placeholderTextColor={Colors.textSecondary}
                                keyboardType="numeric"
                                onChangeText={(text) => setForm({ ...form, prepTime: parseInt(text) || 0 })}
                            />
                        </View>
                    </View>

                    {/* Ingrédients — à venir */}
                    <Text style={styles.label}>Ingrédients</Text>
                    <IngredientSearch onChange={(ingredients) => setForm({ ...form, recipeIngredients: ingredients })} />


                    {/* Catégories — à venir */}
                    <Text style={styles.label}>Catégories</Text>
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Tags — à venir</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.label}>Description <Text style={styles.optional}>(optionnel)</Text></Text>
                    <TextInput
                        style={styles.textarea}
                        placeholder="Décrivez votre recette..."
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => setForm({ ...form, description: text })}
                    />

                    {/* Bouton */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
        paddingVertical: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        maxWidth: '70%',
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    optional: {
        fontWeight: FontWeight.regular,
        color: Colors.textSecondary,
    },
    input: {
        width: '100%',
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    rowItem: {
        flex: 1,
    },
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
    placeholder: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        alignItems: 'center',
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
    },
    saveButton: {
        width: '100%',
        height: ComponentSize.buttonHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    saveButtonText: {
        color: Colors.surface,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
})