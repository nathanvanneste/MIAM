import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

type Tab = "ingredients" | "preparation";

type RecipeScreenProps = {
  recipeID: number;
};


export default function RecipeScreen({ recipeID }: RecipeScreenProps) {
    const [tab, setTab] = useState<Tab>("ingredients");

    return (
        <View >
            <Text>Recette ID : {recipeID}</Text>
        </View>
    );
}


const styles = StyleSheet.create({

});