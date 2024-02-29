import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

const AddSymptom = () => {

  const navigation = useNavigation();

  return (
    <>
      <View style={[styles.outsideContainer]}>
        <TouchableOpacity style={[styles.container]} onPress={() => navigation.navigate('SymptomSelector')} >
          <View style={styles.subcontainer}> 
            <Text style={[styles.heading]}>Add Symptom to Track</Text>
          </View>
          <Text style={[styles.heading]}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outsideContainer: {
    width: "100%",
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

export default AddSymptom;
