import { View, Text, TouchableOpacity } from "react-native";

export default function RecipeScreen() {
    return (
        <View className="flex-1 bg-[#F5EFE8]">

            {/* HEADER */}
            <View className="flex-row items-center justify-between px-4 pt-10 pb-2">
                <Text className="text-xl">←</Text>
                <Text className="text-xl">↗</Text>
            </View>

            {/* TITLE */}
            <View className="px-4">
                <Text className="text-2xl font-bold text-[#4A1E1E]">
                    Tarte aux pommes
                </Text>

                <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-600">6 personnes</Text>
                    <Text className="text-gray-600">⏱ 1h30min</Text>
                </View>
            </View>

            {/* TABS */}
            <View className="flex-row mt-4 px-4">
                <View className="bg-[#EAC8A6] px-4 py-2 rounded-t-xl">
                    <Text className="text-[#A65A2E] font-semibold">Ingrédients</Text>
                </View>

                <View className="bg-[#D9C2AA] px-4 py-2 rounded-t-xl ml-2">
                    <Text className="text-[#A65A2E]">Préparation</Text>
                </View>
            </View>

            {/* CONTENT */}
            <View className="flex-1 bg-[#EAC8A6] px-6 py-4 rounded-t-2xl">

                {/* PORTIONS */}
                <View className="items-center mb-4">
                    <View className="flex-row items-center bg-white px-4 py-1 rounded-full shadow">
                        <Text className="mx-2">-</Text>
                        <Text>6 personnes</Text>
                        <Text className="mx-2">+</Text>
                    </View>
                </View>

                {/* INGREDIENTS */}
                <View className="space-y-2">
                    <Text>• 1 pâte brisée</Text>
                    <Text>• 30g beurre</Text>
                    <Text>• 6 pommes</Text>
                    <Text>• 1 sachet sucre vanillé</Text>
                </View>

                {/* CATEGORY */}
                <View className="mt-6">
                    <Text className="mb-2">Catégorie :</Text>

                    <View className="flex-row space-x-2">
                        <View className="bg-[#7B4A4A] px-3 py-1 rounded-lg">
                            <Text className="text-white">Dessert</Text>
                        </View>

                        <View className="bg-[#7B4A4A] px-3 py-1 rounded-lg">
                            <Text className="text-white">Tarte</Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* BOTTOM BAR */}
            <View className="flex-row justify-around items-center py-3 bg-[#F5EFE8] border-t">
                <Text>＋</Text>
                <Text>👥</Text>
                <Text>👤</Text>
                <Text>📍</Text>
                <Text>🛒</Text>
            </View>

        </View>
    );
}