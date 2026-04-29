import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'

import { router } from "expo-router";


export default function RegisterScreen() {
    return (
        <View >
            <SafeAreaView >
                <Text>bienvenue dans l'onglet d'inscription</Text>

                <View >
                    <Text>Pas encore de compte ?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text >Annuler</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}