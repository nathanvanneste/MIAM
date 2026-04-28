import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getUsers } from "../src/services/users.service";

export default function Index() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUsers()
      .then(setMessage)
      .catch(() => setMessage("Erreur API"));
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>{message}</Text>
    </View>
  );
}
