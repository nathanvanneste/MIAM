import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from '@/src/config/supabase'
import { router } from 'expo-router'

export default function FeedScreen() {
    return (
        <View >
            <Text>bienvenue dans le feed</Text>
            <TouchableOpacity style={{ backgroundColor: 'red', padding: 20, margin: 20, borderRadius: 10 }} onPress={async () => {
                await supabase.auth.signOut()
                router.replace('/welcome')
            }}>
                <Text>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
}