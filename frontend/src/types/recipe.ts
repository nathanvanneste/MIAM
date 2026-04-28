import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Recipe = {
    recipeID: number;
    name: string;
    dateCreation: Date;
    price?: Float;
    nutScore: string;
    prepTime: number;
    cookTime: number;
    photo?: string;
    portion: number;
    description?: string;

};