import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { db } from "../firebase";
import { doc, addDoc, Timestamp, collection } from "firebase/firestore";
import axios from "axios";
import _ from "lodash"; // Import lodash

const FoodSearchScreen = ({ meal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  // Use useCallback to memoize the debounced function
  const delayedQuery = useCallback(
    _.debounce((text) => {
      if (text.trim() !== "") {
        // Call Edamam Food API
        const appId = "383632ee";
        const appKey = "7e1fb8c14264704ea51920f7cb4179c1";
        const apiUrl = `https://api.edamam.com/api/food-database/v2/parser?ingr=${text}&app_id=${appId}&app_key=${appKey}`;

        axios
          .get(apiUrl)
          .then((response) => {
            setSearchResults(response.data.hints);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        setSearchResults([]);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    delayedQuery(searchQuery); // Call the debounced function
    return delayedQuery.cancel; // Cleanup the debounced function on unmount
  }, [searchQuery, delayedQuery]);

  const handleFoodItemClick = async (food) => {
    setSelectedFood(food);
    let foodId = selectedFood.food;
    console.log(food);

    const docRef = await addDoc(collection(db, "savedFoods"), {
      date: Timestamp,
      meal,
      foodId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Search for food..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      {selectedFood && (
        <View>
          <Text>Selected Food: {selectedFood.food.label}</Text>
          <Text>Selected Food: {selectedFood.food.id}</Text>
        </View>
      )}
      <View>
        {searchResults.map((food) => (
          <TouchableOpacity
            key={food.food.foodId}
            onPress={() => handleFoodItemClick(food)}
          >
            <Text>
              {food.food.label} : {food.food.knownAs}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  textInput: {
    backgroundColor: "white",
    height: "10%",
    width: "90%",
    borderRadius: 20,
    marginBottom: "5%",
    fontSize: 14,
    padding: "3%",
  },
});

export default FoodSearchScreen;
