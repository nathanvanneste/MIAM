import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'
import AvatarPicker from '@/src/components/ui/AvatarPicker'

import { router } from "expo-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

export default function RegisterScreen() {
    const [showPassword, setShowPassword] = useState(false)
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    return (
        <View >
            <SafeAreaView >
                <KeyboardAvoidingView>
                    <ScrollView keyboardShouldPersistTaps="handled">

                        {/*Titre*/}
                        <Text>Créer un compte</Text>

                        {/*Avatar*/}
                        <Text>Choisir un avatar (optionnel)</Text>
                        <AvatarPicker onAvatarChange={(uri) => setAvatarUri(uri)} />

                        {/* Formulaire */}
                        <TextInput
                            placeholder="Prénom"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Nom"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            placeholder="Pseudo Ce pseudo sera visible par les autres utilisateurs"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />
                        <View>
                            <TextInput

                                placeholder="Mot de passe"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword
                                    ? <EyeOff size={20} color="#999" />
                                    : <Eye size={20} color="#999" />
                                }
                            </TouchableOpacity>
                            <Text >Minimum 8 caractères avec une minuscule, une majuscule, un chiffre et un caractères spécial</Text>
                        </View>

                        <TouchableOpacity >
                            <Text >Créer mon compte</Text>
                        </TouchableOpacity>

                        {/*Connexion*/}
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text >Connectez vous ici</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View >
    );
}