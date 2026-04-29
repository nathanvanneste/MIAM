import { useEffect, useState } from "react";
import { getIngredientById } from "../services/ingredients.service";
import { View, Text } from "react-native";
import { Ingredient } from "../types/ingredient";
import { CircleUserRound } from 'lucide-react-native'

export default function WelcomeScreen() {
    /*const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    useEffect(() => {
        getIngredientById(20)
            .then(setIngredient)
            .catch(console.error);
    }, []);

    if (!ingredient) {
        return <Text>Chargement...</Text>;
    }*/

    return (
        <View>
            <CircleUserRound size={100} color="#13da5fb6" />
            <Text>[Logo de l'app]</Text>
            <Text>Bienvenue !</Text>
            <Text>Connecte-toi pour continuer</Text>
            <Text>[Zone d'ecriture] Email ou pseudo</Text>
            <Text>[Zone d'ecriture masquée] Mot de passe</Text>
            <Text>mdp oublié ?</Text>
            <Text>[Bouton] Se connecter</Text>
            <Text>Pas encore de compte ?</Text>
            <Text>[Zone cliquable] Créer un compte</Text>
        </View >
    );
}

