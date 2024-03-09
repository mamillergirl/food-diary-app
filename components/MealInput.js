import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './Card';

const MealInput = ({ headingText, color, date, path }) => {
  // Reload component when date changes
  useEffect(() => {
   
  }, [date]);

  return (
    <View style={styles.container}>
      <Card color='#2ED12E' path={path} date={date} type="Breakfast" category="Meal" />
      <Card color='#FFA935' path={path} date={date} type="Lunch" category="Meal" />
      <Card color='#12E5B0' path={path} date={date} type='Dinner' category="Meal" />
      <Card color='#B575E7' path={path} date={date} type='Snack' category="Meal" />
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
