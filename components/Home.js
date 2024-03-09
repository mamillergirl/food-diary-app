
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View,  Text, ScrollView, Image, StyleSheet } from 'react-native';
import Header from './Header';
import MealInput from './MealInput';
import SymptomInput from './SymptomInput';

export default function Home (){
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zeros if month/day is less than 10
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }
  return (
    <SafeAreaView style={styles.container}>
      
        <View style={styles.subcontainer}>
          <Header headingText="Hello, Marisa!" />
          
        </View>

        <ScrollView>
        <Text style={styles.subheading}>Daily Meals</Text>
        <MealInput path={'HomeScreen'} date={currentDate} headingText="Meal Input" />
   

        <Text style={styles.subheading}>Symptom Overview</Text>
        <SymptomInput date={currentDate} headingText="Symptom Input" />
       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  subheading: {
    fontFamily: 'Inter',
    fontSize: 20,
    paddingLeft: '7%',
    fontWeight: '400'
  },
  subcontainer: {
    width: '100%',
  }
});


