import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';


import AddItem from './AddItem';

const Card = ({ color, type, category }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the component is open

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
    {isOpen? <AddItem content="Add Food"  type="breakfast"/>: <></>}
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
});

export default Card;
