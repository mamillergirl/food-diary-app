import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

import SymptomCard from './SymptomCard';
import AddSymptom from './AddSymptom';

const SymptomInput = ({ headingText, color }) => {
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
  }, []);

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
