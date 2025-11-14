import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Products</Text>

      <Button
        title="Go to Product 1"
        onPress={() =>
          navigation.navigate("product", {
            id: 1,
            name: "Apple",
            price: 120,
          })
        }
      />

      <View style={{ height: 20 }} />

      <Button
        title="Go to Cart"
        onPress={() => navigation.navigate("cart")}
      />
    </View>
  );
}
