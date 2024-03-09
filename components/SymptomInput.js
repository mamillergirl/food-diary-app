import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

import SymptomCard from './SymptomCard';
import AddSymptom from './AddSymptom';

const SymptomInput = ({ headingText, color, date }) => {
  const [symptoms, setSymptoms] = useState([]);

  const fetchSymptoms = async () => {
    try {
      const docRef = doc(db, "user", "Xt9jJu2sHvNk6oSpbrMd");
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.trackSymptoms) {
          setSymptoms(data.trackSymptoms);
        }
      }
     
    } catch (error) {
      console.error("Error fetching symptoms: ", error);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, [date]);

  // Ensure that fetchSymptoms is called whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchSymptoms();
    }, [fetchSymptoms])
  );

  return (
    <View style={styles.container}>
      {symptoms.map((symptom, index) => (
        <SymptomCard
          key={index}
          color='#FF655B'
          type={symptom}
          date={date} // Pass the date prop down to SymptomCard
        />
      ))}
      <AddSymptom />
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

export default SymptomInput;
