import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/cartSlice";

export default function CartScreen() {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Cart Items</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: "#eee",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>₹{item.price}</Text>

            <Button
              title="Remove"
              onPress={() => dispatch(removeFromCart(item.id))}
            />
          </View>
        )}
      />
    </View>
  );
}
