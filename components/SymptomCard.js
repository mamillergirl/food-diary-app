import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { db } from "../firebase";
import { collection, Timestamp, getDoc, doc, setDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const SymptomCard = ({ color, type, date }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const icons = {
    0: "sentiment-very-satisfied", // Good
    1: "sentiment-satisfied",
    2: "sentiment-neutral",
    3: "sentiment-dissatisfied",
    4: "sentiment-very-dissatisfied", // Bad
  };

  const onValueChange = async (value) => {
    setSliderValue(value);
    const key = `${date}_${type.toLowerCase()}`;

    try {
      await setDoc(doc(db, 'symptoms', key), {
        level: value,
        day: Timestamp.fromDate(new Date()),
        type: type.toLowerCase(),
      });
    } catch (error) {
      console.error("Error updating/adding document: ", error);
    }
  };

  const fetchSymptom = async (symptomDate) => {
    const key = `${symptomDate}_${type.toLowerCase()}`;
    const docRef = doc(db, "symptoms", key);

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.level) {
          setSliderValue(data.level);
        } else {
          setSliderValue(0); // Reset slider value if no data found
        }
      } else {
        setSliderValue(0); // Reset slider value if no data found
      }
    } catch (error) {
      console.error("Error fetching symptoms: ", error);
    }
  };

  useEffect(() => {
    fetchSymptom(date);
  }, [date]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.subcontainer}>
          <View style={[styles.side, { backgroundColor: color }]}></View>
          <Text style={[styles.heading, { color: color }]}>{type}</Text>
        </View>
        <Slider
          style={{ width: "50%", height: 40 }}
          minimumValue={0}
          maximumValue={4}
          step={1}
          minimumTrackTintColor="#FF655B"
          maximumTrackTintColor="#000000"
          onValueChange={onValueChange}
          value={sliderValue}
        />
        <Icon name={icons[sliderValue]} size={32} color="black" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: "5%",
  },
  subcontainer: {
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  heading: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    fontWeight: "bold",
    padding: "5%",
  },
  side: {
    width: 15,
    height: "100%",
    marginRight: 10,
  },
});

export default SymptomCard;
