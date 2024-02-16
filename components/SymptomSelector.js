import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { db } from "../firebase";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";

const SymptomSelector = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomList, setSymptomList] = useState([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const q = query(collection(db, "symptomDictionary"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const symptomData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSymptoms(symptomData);
        });
        return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
      } catch (error) {
        console.error("Error fetching symptoms: ", error);
      }
    };
    fetchSymptoms();
  }, []);

  const handleClick = async (symptom) => {
    try {
      const subcollectionQuerySnapshot = await getDocs(collection(db, 'symptomDictionary', symptom.id, 'symptoms'));
      const subcollectionData = subcollectionQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSymptomList(subcollectionData);
    } catch (error) {
      console.error("Error fetching subcollection: ", error);
    }
  };
  return (
    <SafeAreaView>
      {symptoms.map((symptom) => (
        <View key={symptom.id} style={styles.symptomGroup}>
          <TouchableOpacity
            style={styles.symptomItem}
            onPress={() => handleClick(symptom)} // Using onPress instead of onClick
          >
            <Text style={styles.groupTitle}>{symptom.groupName}</Text>
          </TouchableOpacity>
        </View>
      ))}
      {symptomList.map((symptom) => (
        <View key={symptom.id} style={styles.symptomGroup}>
        
            <Text style={styles.symptom}>{symptom.symptom}</Text>
  
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = {
  symptomGroup: {
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  symptomItem: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 5,
  },
  symptom: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 5,
    padding:10,
  },
};

export default SymptomSelector;
