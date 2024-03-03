import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { db } from "../firebase";
import { collection, getDocs, getDoc, query, onSnapshot, doc, addDoc, updateDoc} from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons

const SymptomSelector = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomList, setSymptomList] = useState([]);

  const navigation = useNavigation();
  
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
    if (selectedCategory === symptom.groupName) {
      setSymptomList([]);
      setSelectedCategory(null);
      setSelectedSymptom(null);
    } else {
      setSelectedCategory(symptom.groupName);
      setSymptomList(symptom.symptoms);
    }
  };

  const handleSymptomSelect = async (symptom) => {
    setSelectedSymptom(symptom);
    
    // Check if the selected symptom is already tracked
    const userRef = doc(db, "user", 'Xt9jJu2sHvNk6oSpbrMd');
    const userSnapshot = await getDoc(userRef);
    const user = userSnapshot.data();
  
    if (user.trackSymptoms && user.trackSymptoms.includes(symptom)) {
      console.log("Symptom is already tracked:", symptom);
    } else {
      try {
        const updatedSymptoms = user.trackSymptoms ? [...user.trackSymptoms, symptom] : [symptom];
        await updateDoc(userRef, {
          trackSymptoms: updatedSymptoms,
        });
        navigation.navigate('HomeScreen')
      } catch (error) {
        console.error("Error updating tracked symptoms:", error);
      }
    }
  };
  
  

  return (
    <SafeAreaView>
      <View>
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity 
                style={[
                  styles.symptomItem,
                ]}
                onPress={() => handleClick(item)}
              >
                <Text style={styles.symptomGroup}>{item.groupName}</Text>
                <Ionicons
                  name={selectedCategory === item.groupName ? 'chevron-up' : 'chevron-down'} // Change the icon based on selection
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              {selectedCategory === item.groupName && (
                <FlatList
                  data={symptomList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.symptomItem,
                        styles.subItem,
                        selectedSymptom === item && styles.selectedSymptom,
                      ]}
                      onPress={() => handleSymptomSelect(item)}
                    >
                      <Text style={styles.symptom}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  symptomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    marginLeft: "5%",
    borderRadius: 5,
    width: "90%",
  },
  subItem: {
    width: "80%",
    marginLeft: '10%',
  },

  symptomGroup: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    padding: 10,
  },
  symptom: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF655B",
    marginBottom: 5,
    padding: 10,
  },
  selectedSymptom: {
    backgroundColor: "lightgray",
  },
};

export default SymptomSelector;
