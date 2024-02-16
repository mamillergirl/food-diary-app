import React, { useState, useEffect } from "react";
import { SafeAreaView, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { firebase, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";


export default function ChartComponent() {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "symptoms"), where("type", "==", "diarrhea"), orderBy("day", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const { day, level } = doc.data();
        const date = new Date(day.toDate()).toLocaleDateString();

        const numericLevel = parseFloat(level);

        if (!isNaN(numericLevel)) {
          data.push({ date, level: numericLevel });
        } else {
          console.log("Invalid level value:", level);
        }
      });

      if (data.length > 0) {
        setGraphData(data);
      }
    });

    return unsubscribe;
  }, []);

  // Display debug text to check if data is fetched
  if (graphData.length === 0) {
    return (
      <SafeAreaView>
        <Text>No data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <LineChart
        data={{
          labels: graphData.map((dataPoint) => dataPoint.date),
          datasets: [
            {
              data: graphData.map((dataPoint) => dataPoint.level)
            }
          ]
        }}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          },
          
        }}
        bezier
        fromZero
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </SafeAreaView>
  );
}
