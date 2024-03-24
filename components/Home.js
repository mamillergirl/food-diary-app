
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View,  Text, ScrollView, Image, StyleSheet } from 'react-native';
import Header from './Header';
import MealInput from './MealInput';
import SymptomInput from './SymptomInput';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, deleteDoc } from "firebase/firestore";


export default function Home (){
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const [firstName, setFirstName] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            setFirstName(data.firstName);

          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

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
          <Header headingText={`Hello, ${firstName}!`} />
          
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
    fontSize: 20,
    paddingLeft: '7%',
    fontWeight: '400'
  },
  subcontainer: {
    width: '100%',
  }
});


