import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

const MealInput = ({ headingText, color }) => {
  return (
    <View style={styles.container}>
      <Card color='#2ED12E' type="Breakfast" category="Meal" />
      <Card color='#FFA935' type="Lunch" category="Meal" />
      <Card color='#12E5B0' type='Dinner' category="Meal" />
      <Card color='#B575E7' type='Snack' category="Meal" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%',
  },
});

export default MealInput;
