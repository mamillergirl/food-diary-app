import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { db } from "../firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

import AddItem from './AddItem';

const Card = ({ color, type, category, navigation }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the component is open
  const [foods, setFoods] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const parentCollectionRef = collection(db, "savedFoods");
  const collectionDocRef = doc(parentCollectionRef, currentDate);
  const mealCollectionRef = collection(collectionDocRef, `${currentDate}_${type.toLowerCase()}`);

  const getFoods = async () => {
    const querySnapshot = await getDocs(mealCollectionRef);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFoods(data);
  };

  const deleteFood = async (id) => {
    await deleteDoc(doc(mealCollectionRef, id));
    getFoods();
  };

  // Fetch data on component mount and whenever the screen is navigated back to
  useEffect(() => {
    getFoods();
  }, []);

  // Fetch data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getFoods();
    }, [])
  );

  // Function to toggle the component
  const toggleComponent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <TouchableOpacity style={[styles.container]} onPress={toggleComponent}>
        <View style={styles.subcontainer}>
          <View style={[styles.side, { backgroundColor: color }]}></View>
          <Text style={[styles.heading, { color: color }]}>{type}</Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'} // Change the icon based on selection
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isOpen ? <AddItem content="Add Food" type={type} /> : <></>}
      {isOpen && foods.map((food) => (
        <View style={styles.foodContainer} key={food.id}>
          <Text style={styles.food}>
            {food.name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
          </Text>
          <Button title="Delete" onPress={() => deleteFood(food.id)} />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: '5%'
  },
  subcontainer: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  heading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    padding: '5%',
  },
  side: {
    width: 15,
    height: '100%',
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    padding: '1%'
  },
  foodContainer: {
    width: "90%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  food: {
    fontSize: 16,
    fontWeight: "bold",
    padding: "5%",
    width: "80%",
  }
});

export default Card;
