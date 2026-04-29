import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

type Tab = "ingredients" | "preparation";

export default function RecipeScreen() {
    const [tab, setTab] = useState<Tab>("ingredients");

    return (
        <View >
        </View>
    );
}


const styles = StyleSheet.create({

});