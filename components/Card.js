import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { db } from "../firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

import AddItem from './AddItem';

const Card = ({ color, type, category, navigation, date, path}) => { 
  const [isOpen, setIsOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  

  const getFoods = async (mealCollectionRef) => {
    const querySnapshot = await getDocs(mealCollectionRef);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFoods(data);
  };

  const deleteFood = async (id) => {
    const parentCollectionRef = collection(db, "savedFoods");
    const collectionDocRef = doc(parentCollectionRef, date);
    const mealCollectionRef = collection(collectionDocRef, `${date}_${type.toLowerCase()}`);
    await deleteDoc(doc(mealCollectionRef, id));
    getFoods(mealCollectionRef); // Pass mealCollectionRef here
  };

  useEffect(() => {
    const parentCollectionRef = collection(db, "savedFoods");
    const collectionDocRef = doc(parentCollectionRef, date);
    const mealCollectionRef = collection(collectionDocRef, `${date}_${type.toLowerCase()}`);
    getFoods(mealCollectionRef);

  }, [date]); 

  // Fetch data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      
      const parentCollectionRef = collection(db, "savedFoods");
      const collectionDocRef = doc(parentCollectionRef, date);
      const mealCollectionRef = collection(collectionDocRef, `${date}_${type.toLowerCase()}`);
      getFoods(mealCollectionRef);
      setIsOpen(false);
    }, [])
  );

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
      {isOpen ? <AddItem path={path} date={date} content="Add Food" type={type} /> : <></>}
      {isOpen && foods.map((food, index) => (
        <>
        <TouchableOpacity onPress={() => {
    if (selectedFood && selectedFood.id === food.id) {
      setSelectedFood(null);
    } else {
      setSelectedFood(food);
    }
  }} style={styles.foodContainer} key={index}>
          <Text style={styles.food}>
            {food.name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
          </Text>
          <Button title="Delete" onPress={() => deleteFood(food.id)} />
        </TouchableOpacity>
        {selectedFood && selectedFood.id === food.id ? (
          <View style={styles.selectedFoodContainer}>
            <View>
          <Text style={styles.foodExtra}>{selectedFood.servingSize} {selectedFood.servingMeasurement.split("_")[1]}</Text>
          <Text style={styles.foodExtra}>{selectedFood.calories} Calories</Text>
          </View> 
          {
            selectedFood.totalNutrients ? (
              <View>
              <Text style={styles.foodExtra}>{parseFloat(selectedFood.totalNutrients?.CHOCDF.quantity).toFixed(1)} Grams Carb</Text>
              <Text style={styles.foodExtra}>{parseFloat(selectedFood.totalNutrients?.FIBTG.quantity).toFixed(1)} Grams Fiber</Text> 
              <Text style={styles.foodExtra}>{parseFloat(selectedFood.totalNutrients?.FAT.quantity).toFixed(1)} Grams Fat</Text>
              <Text style={styles.foodExtra}>{parseFloat(selectedFood.totalNutrients?.PROCNT.quantity).toFixed(1)} Grams Protein</Text>
              </View>
            ) : (
              <></>
            )
          }
  
          </View>
        )  : (
      <></>
    )}
        </>
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
  selectedFoodContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: '-4%',
    padding: '5%',
    marginBottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  foodExtra: {
    fontSize: 17,
    marginBottom: '5%',
    maxWidth: '100%',
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
