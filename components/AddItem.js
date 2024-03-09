import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

const AddItem = ({ content, type, date, path}) => {
  const [currentDate, setCurrentDate] = useState(date);
  const navigation = useNavigation();

  // useEffect to trigger when the date prop changes
  useEffect(() => {
    setCurrentDate(date);
 
  }, [date]);

  return (
    <>
      <View style={[styles.outsideContainer]}>
        <TouchableOpacity style={[styles.container]} onPress={() => navigation.navigate('Search Foods', { meal: type, currentDate: currentDate, path:path })} >
          <View style={styles.subcontainer}>
            <Text style={[styles.heading]}>{content}</Text>
          </View>
          <Text style={[styles.heading]}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outsideContainer: {
    width: "90%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: "5%",
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  subcontainer: {
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    padding: "5%",
    color: "#808080",
  },
});

export default AddItem;
