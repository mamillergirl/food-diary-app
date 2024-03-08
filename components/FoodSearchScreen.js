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
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase";
import { doc, addDoc, Timestamp, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import _ from "lodash";

const FoodSearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const { meal } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servingSize, setServingSize] = useState(1);
  const [servingMeasurement, setServingMeasurement] = useState("");
  const [healthLabels, setHealthLabels] = useState([]);
  const [missingLabels, setMissingLabels] = useState([]);

  const appKey = process.env["APP_KEY"];
  const appId = process.env["APP_ID"];

  const desiredHealthLabels = [
    "ALCOHOL_FREE",
    "CELERY_FREE",
    "CRUSTACEAN_FREE",
    "DAIRY_FREE",
    "EGG_FREE",
    "FISH_FREE",
    "GLUTEN_FREE",
    "KETO_FRIENDLY",
    "LOW_FAT_ABS",
    "LOW_SUGAR",
    "PALEO",
    "PEANUT_FREE",
    "PORK_FREE",
    "RED_MEAT_FREE",
    "SESAME_FREE",
    "SHELLFISH_FREE",
    "SOY_FREE",
    "TREE_NUT_FREE",
    "VEGAN",
    "VEGETARIAN",
    "WHEAT_FREE",
  ];



  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const delayedQuery = useCallback(
    _.debounce((text) => {
      if (text.trim() !== "") {
        const apiUrl = `https://api.edamam.com/api/food-database/v2/parser?ingr=${text}&app_id=${appId}&app_key=${appKey}`;
        const filtered = [];
        axios
          .get(apiUrl)
          .then((response) => {
            
            setSearchResults(response.data.hints);
            response.data.hints.forEach(element => {
              if(findHealthLabels(element)){
                filtered.push(element);
              }
              
            });
            setFilteredResults(filtered);
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

  const findHealthLabels = async(food) => {
    let requestBody = {
      ingredients: [
        {
          quantity: 1,
          measureURI: food.measures[0].uri,
          foodId: food.food.foodId
        }
      ],
    };
    
    const response = await axios.post(
      `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appId}&app_key=${appKey}`,
      requestBody
    );
    
    if (response.data.healthLabels.length > 0) {
      return true;
    } 
  }

  useEffect(() => {
   
    delayedQuery(searchQuery);
   
    return delayedQuery.cancel;

    
  }, [searchQuery, delayedQuery]);

  const handleFoodItemClick = (food) => {
    setSelectedFood(food);
    setServingSize(1);
    setServingMeasurement(food.measures[0].uri);
    setShowModal(true);
  };

  const saveSelectedFood = async () => {
    setShowModal(false);

    const requestBody = {
      ingredients: [
        {
          quantity: servingSize,
          measureURI: servingMeasurement,
          foodId: selectedFood.food.foodId,
        },
      ],
    };


    try {
      const response = await axios.post(
        `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appId}&app_key=${appKey}`,
        requestBody
      );
      
     
      let missingLabels = desiredHealthLabels.filter(
        (label) => !response.data.healthLabels.includes(label)
      );
     
     
  

      const currentDate = new Date().toISOString().split("T")[0];

      const parentCollectionRef = collection(db, "savedFoods");
      const collectionDocRef = doc(parentCollectionRef, currentDate);

      const mealCollectionRef = collection(
        collectionDocRef, `${currentDate}_${meal.toLowerCase()}`);

      const docRef = await addDoc(mealCollectionRef, {
        name: selectedFood.food.knownAs,
        servingSize: servingSize,
        servingMeasurement: servingMeasurement,
        foodId: selectedFood.food.foodId,
        healthLabels: response.data.healthLabels,
        missingLabels: missingLabels,
      }).then(() => {
        navigation.navigate("HomeScreen");
      })
  
      
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="black"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Search for food..."
          onChangeText={(text) => {setSearchQuery(text); setFilteredResults([])}}
          value={searchQuery}
        />
      </View>

      {selectedFood && (
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.selectedFoodLabel}>
                    {capitalizeWords(selectedFood.food.knownAs)}
                  </Text>

                  {selectedFood.food.image ? (
                    <Image
                      source={{ uri: selectedFood.food.image }}
                      style={styles.image}
                    />
                  ) : null}
                  {selectedFood.food.brand ? (
                    <Text style={styles.additionalInfoText}>
                      Brand: {selectedFood.food.brand}
                    </Text>
                  ) : null}
                  {selectedFood.food.category ? (
                    <Text style={styles.additionalInfoText}>
                      Category: {selectedFood.food.category}
                    </Text>
                  ) : null}

                  <View style={styles.inputContainer}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={servingSize}
                        onValueChange={(itemValue, itemIndex) =>
                          setServingSize(itemValue)
                        }
                      >
                        {[...Array(25).keys()].map((number) => (
                          <Picker.Item
                            key={number}
                            label={`${number + 1}`}
                            value={`${number + 1}`}
                          />
                        ))}
                      </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={servingMeasurement}
                        onValueChange={(itemValue, itemIndex) =>
                          setServingMeasurement(itemValue)
                        }
                      >
                        {selectedFood?.measures.map((measurement, index) => (
                          <Picker.Item
                            key={index}
                            label={measurement.label}
                            value={measurement.uri}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.buttons}>
                    <Button title="Save" onPress={saveSelectedFood} />
                    <Button
                      title="Cancel"
                      onPress={() => setShowModal(false)}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <ScrollView style={styles.resultContainer}>
        {filteredResults.map((food, index) => (
          <TouchableOpacity
            key={`${food.food.foodId}-${index}`}
            onPress={() => handleFoodItemClick(food)}
            style={styles.resultItem}
          >
            <Text style={styles.resultText}>
              {capitalizeWords(food.food.knownAs)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 5,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  resultText: {
    flex: 1,
    fontSize: 17,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: "80%",
  },
  selectedFoodLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  additionalInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FoodSearchScreen;
