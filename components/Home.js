
import React from 'react';
import { SafeAreaView, View,  Text, ScrollView, Image, StyleSheet } from 'react-native';
import Header from './Header';
import MealInput from './MealInput';
import SymptomInput from './SymptomInput';

export default function Home (){
  return (
    <SafeAreaView style={styles.container}>
      
        <View style={styles.subcontainer}>
          <Header headingText="Hello, Marisa!" />
          
        </View>

        <ScrollView>
        <Text style={styles.subheading}>Daily Meals</Text>
        <MealInput headingText="Meal Input" />
   

        <Text style={styles.subheading}>Daily Symptoms</Text>
        <SymptomInput headingText="Symptom Input" />
       
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


