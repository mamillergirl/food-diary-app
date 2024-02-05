import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FoodSearchScreen from './FoodSearchScreen';


const AddItem = ({ content }) => {
  const [isSearching, setIsSearching] = useState(false); // State to track whether the searching component is open

  // Function to toggle the searching component
  const toggleSearching = () => {
    setIsSearching(!isSearching);
  };

  return (
    <>
    <View style={[styles.outsideContainer]} >
      <TouchableOpacity style={[styles.container]} onPress={toggleSearching}>
        <View style={styles.subcontainer}>
          <Text style={[styles.heading]}>{content}</Text>
        </View>
        <Text style={[styles.heading]}>+</Text>
      </TouchableOpacity>
     
    </View>
     {isSearching && <FoodSearchScreen/>} 
     </>
  );
};

const styles = StyleSheet.create({
  outsideContainer: {
    width: '90%',
    height: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: '5%'
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden'
  },
  subcontainer: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: '5%',
    color: '#808080',
  },
});

export default AddItem;
