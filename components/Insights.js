import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { auth, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import GraphWithTooltip from "./GraphWithToolTip";
import IndividualGraphs from "./IndividualGraphs";
import AverageAnalysis from "./AverageAnalysis";

export default function Insights() {

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={[styles.heading, styles.title]}>
          Understanding Your Symptoms
        </Text>
        <AverageAnalysis />
        <IndividualGraphs />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6DA0D1",
    marginBottom: 10,
    marginLeft: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    width: "50%", // Make each child take up half of the row
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#FF655B",
    color: "white",
    fontWeight: "bold",
    borderRadius: 10,
    padding: 10,
  },
});
