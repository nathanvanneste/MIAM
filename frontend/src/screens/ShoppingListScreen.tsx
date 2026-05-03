import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, Trash2, Check } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, ComponentSize } from '@/src/constants'
import { ShoppingList, ShoppingItem } from '@/src/types/shoppingList'
import { toggleItem, removeItem, addItem } from '@/src/services/shoppingList.service'
import AddShoppingItem from '@/src/components/features/shopping/AddShoppingItem'

// Mock en attendant les endpoints back
const MOCK_LISTS: ShoppingList[] = [
    {
        listID: 1,
        name: 'Ma liste',
        userID: 'me',
        items: [
            { itemID: 1, name: 'Farine', quantity: 500, checked: false, listID: 1 },
            { itemID: 2, name: 'Oeufs', quantity: 6, checked: true, listID: 1 },
        ]
    },
    {
        listID: 2,
        name: 'Coloc 🏠',
        groupID: 1,
        items: [
            { itemID: 3, name: 'Lait', quantity: 2, checked: false, listID: 2 },
        ]
    },
]

export default function ShoppingListScreen() {
    const [lists, setLists] = useState<ShoppingList[]>(MOCK_LISTS)
    const [selectedListID, setSelectedListID] = useState<number>(MOCK_LISTS[0].listID)
    const [newItemName, setNewItemName] = useState('')
    const [newItemQuantity, setNewItemQuantity] = useState('')

    const currentList = lists.find(l => l.listID === selectedListID)!

    const handleToggle = async (item: ShoppingItem) => {
        // Optimistic update
        setLists(prev => prev.map(list =>
            list.listID === selectedListID
                ? {
                    ...list, items: list.items.map(i =>
                        i.itemID === item.itemID ? { ...i, checked: !i.checked } : i
                    )
                }
                : list
        ))
        try {
            await toggleItem(item.itemID)
        } catch (e) {
            // Rollback
            setLists(prev => prev.map(list =>
                list.listID === selectedListID
                    ? {
                        ...list, items: list.items.map(i =>
                            i.itemID === item.itemID ? { ...i, checked: item.checked } : i
                        )
                    }
                    : list
            ))
        }
    }

    const handleRemove = async (itemID: number) => {
        const previousLists = lists
        setLists(prev => prev.map(list =>
            list.listID === selectedListID
                ? { ...list, items: list.items.filter(i => i.itemID !== itemID) }
                : list
        ))
        try {
            await removeItem(itemID)
        } catch (e) {
            setLists(previousLists)
        }
    }

    const handleAdd = async (newItem: Omit<ShoppingItem, 'itemID'>) => {
        const tempID = Date.now()
        const tempItem = { ...newItem, itemID: tempID }
        const previousLists = lists

        setLists(prev => prev.map(list =>
            list.listID === selectedListID
                ? { ...list, items: [...list.items, tempItem] }
                : list
        ))

        try {
            await addItem(selectedListID, {
                name: newItem.name,
                quantity: newItem.quantity,
                listID: selectedListID,
                ingredientID: newItem.ingredientID,
                unitID: newItem.unitID,
            })
        } catch (e) {
            setLists(previousLists)
        }
    }

    const uncheckedItems = currentList.items.filter(i => !i.checked)
    const checkedItems = currentList.items.filter(i => i.checked)

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Courses</Text>
                <Text style={styles.itemCount}>{uncheckedItems.length} restant{uncheckedItems.length > 1 ? 's' : ''}</Text>
            </View>

            {/* Selector */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectorContainer}
            >
                {lists.map(list => (
                    <TouchableOpacity
                        key={list.listID}
                        style={[styles.selectorChip, selectedListID === list.listID && styles.selectorChipActive]}
                        onPress={() => setSelectedListID(list.listID)}
                    >
                        <Text style={[styles.selectorText, selectedListID === list.listID && styles.selectorTextActive]}>
                            {list.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Liste */}
            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>

                {/* Items non cochés */}
                {uncheckedItems.map(item => (
                    <View key={item.itemID} style={styles.item}>
                        <TouchableOpacity style={styles.checkbox} onPress={() => handleToggle(item)}>
                            <View style={styles.checkboxInner} />
                        </TouchableOpacity>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.quantity && <Text style={styles.itemQty}>{item.quantity}</Text>}
                        <TouchableOpacity onPress={() => handleRemove(item.itemID)}>
                            <Trash2 size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Items cochés */}
                {checkedItems.length > 0 && (
                    <View style={styles.checkedSection}>
                        <Text style={styles.checkedLabel}>Déjà dans le panier ({checkedItems.length})</Text>
                        {checkedItems.map(item => (
                            <View key={item.itemID} style={[styles.item, styles.itemChecked]}>
                                <TouchableOpacity style={[styles.checkbox, styles.checkboxChecked]} onPress={() => handleToggle(item)}>
                                    <Check size={12} color={Colors.surface} />
                                </TouchableOpacity>
                                <Text style={[styles.itemName, styles.itemNameChecked]}>{item.name}</Text>
                                {item.quantity && <Text style={styles.itemQty}>{item.quantity}</Text>}
                                <TouchableOpacity onPress={() => handleRemove(item.itemID)}>
                                    <Trash2 size={16} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Ajouter un item */}
            <View style={styles.addContainer}>
                <AddShoppingItem listID={selectedListID} onAdd={handleAdd} />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    itemCount: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    selectorContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    selectorChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    selectorChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    selectorText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
    },
    selectorTextActive: {
        color: Colors.surface,
    },
    list: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    itemChecked: {
        opacity: 0.5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    itemName: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    itemNameChecked: {
        textDecorationLine: 'line-through',
        color: Colors.textSecondary,
    },
    itemQty: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    checkedSection: {
        marginTop: Spacing.lg,
    },
    checkedLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    addContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background,
    },
    addInput: {
        flex: 1,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    addQtyInput: {
        width: 60,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.sm,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    addButton: {
        width: ComponentSize.inputHeight,
        height: ComponentSize.inputHeight,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
})