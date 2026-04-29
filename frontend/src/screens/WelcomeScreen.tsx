import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Eye, EyeOff, CircleUserRound } from 'lucide-react-native';
import { router } from "expo-router";
import { useState } from 'react'
import { Image } from 'react-native'
import logo from '@/src/assets/images/logo.png'



export default function WelcomeScreen() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={logo} style={{ width: 200, height: 200, resizeMode: 'contain' }} />
                </View>

                {/* Titre */}
                <Text style={styles.welcome}>Bienvenue !</Text>
                <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>

                {/* Formulaire */}
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email ou pseudo"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
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
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.replace('/(tabs)/feed')}
                    >
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>

                {/* Inscription */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Pas encore de compte ?</Text>
                    <TouchableOpacity>
                        <Text style={styles.registerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF7',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D2D2D',
        letterSpacing: 4,
        marginTop: 8,
    },
    welcome: {
        fontSize: 26,
        fontWeight: '600',
        color: '#3D0B0C',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        marginBottom: 36,
    },
    form: {
        width: '100%',
        gap: 16,
    },
    input: {
        width: '100%',
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#2D2D2D',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        height: 52,
    },
    passwordInput: {
        flex: 1,
        fontSize: 15,
        color: '#2D2D2D',
    },
    forgotPassword: {
        fontSize: 13,
        color: '#9D7F7C',
        textAlign: 'right',
    },
    loginButton: {
        width: '100%',
        height: 52,
        backgroundColor: '#3A0C0C',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerContainer: {
        alignItems: 'center',
        marginTop: 40,
        gap: 6,
    },
    registerText: {
        fontSize: 14,
        color: '#888',
    },
    registerLink: {
        fontSize: 14,
        color: '#AB4442',
        fontWeight: '600',
    },
});