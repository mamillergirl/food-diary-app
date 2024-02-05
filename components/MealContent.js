import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AddItem from './AddItem'


export default function MealContent({ color, type }) {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the component is open

  // Function to toggle the component
  const toggleComponent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <AddItem content="Add Food item"/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '95%',
    height: 70,
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
  side: {
    width: 15,
    height: '100%',
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
  },
});


