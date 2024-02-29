import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';



import AddItem from './AddItem';

const SymptomCard = ({ color, type}) => {




  return (
    <>
    <TouchableOpacity style={[styles.container]}>
      <View style={styles.subcontainer}>
        <View style={[styles.side, { backgroundColor: color }]}></View>
        <Text style={[styles.heading, { color: color }]}>{type}</Text>
      </View>

  
    </TouchableOpacity>

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

export default SymptomCard;
