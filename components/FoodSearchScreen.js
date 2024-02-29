import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { db } from "../firebase";
import { doc, addDoc, Timestamp, collection } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import _ from "lodash"; // Import lodash

const FoodSearchScreen = ({ route }) => {
  const { meal } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  
  const delayedQuery = useCallback(
    _.debounce((text) => {
      if (text.trim() !== "") {

        const appKey = process.env['APP_KEY'];
        const appId = process.env['APP_ID'];
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
    }, 500),
    []
  );

  useEffect(() => {
    delayedQuery(searchQuery); // Call the debounced function
    return delayedQuery.cancel; // Cleanup the debounced function on unmount
  }, [searchQuery, delayedQuery]);

  const handleFoodItemClick = async (food) => {
    
    setSelectedFood(food);
    let foodId = food.food;
  
    const docRef = await addDoc(collection(db, "savedFoods"), {
      //date: Timestamp,
      meal,
      foodId,
    });
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Search for food..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      {selectedFood && (
        <View>
          <Text>Selected Food: {selectedFood.food.label}</Text>
        </View>
      )}
      <ScrollView style={styles.resultContainer}>
      {searchResults.map((food, index) => (
        <TouchableOpacity
          key={`${food.food.foodId}-${index}`} // Using a combination of foodId and index
          onPress={() => handleFoodItemClick(food)}
          style={styles.resultItem}
        >
          <Text style={styles.resultText}>
            {food.food.label} 
          </Text>
        </TouchableOpacity>
      ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: "5%",
    width: "90%",
    height: "10%",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    padding: 0,
  },
  resultContainer: {
    width: "92%",
  },
  resultItem: {
    flexDirection: 'row', // Ensure items are laid out in a row
    alignItems: 'center', // Align items vertically within their container
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  resultText: {
    flex: 1, // Allow text to expand to fill available space
    fontSize: 17,
    color: 'black',
  },
});

export default FoodSearchScreen;
