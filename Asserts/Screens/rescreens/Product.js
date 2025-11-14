import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

export default function ProductScreen({ route }) {
  const { id, name, price } = route.params;
  const dispatch = useDispatch();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{name}</Text>
      <Text style={{ fontSize: 18 }}>Price: ₹{price}</Text>

      <Button
        title="Add to Cart"
        onPress={() =>
          dispatch(addToCart({ id, name, price }))
        }
      />
    </View>
  );
}
