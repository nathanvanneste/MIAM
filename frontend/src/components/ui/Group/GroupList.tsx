// src/components/layout/Group/GroupList.tsx

import { View, StyleSheet } from "react-native";
import GroupCard from "../../ui/Group/GroupCard";

type Group = {
  id: number;
  image: string;
  title: string;
  membersCount: number;
  recipesCount: number;
};

type Props = {
  groups: Group[];
  onPress?: (group: Group) => void;
};

export default function GroupList({ groups, onPress }: Props) {
  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          image={group.image}
          title={group.title}
          membersCount={group.membersCount}
          recipesCount={group.recipesCount}
          onPress={() => onPress?.(group)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 13, // espace vertical propre entre les cards
    paddingTop: 10,
  },
});