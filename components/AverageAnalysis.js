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

export default function AverageAnalysis() {
  const [averageGraphData, setAverageGraphData] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topLabels, setTopLabels] = useState([]);

  // Function to fetch symptoms from Firestore
  const fetchSymptoms = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
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

  // Function to fetch symptom data from Firestore
  const fetchIndividualSymptomData = async () => {
    try {
      const newGraphData = {};
      const promises = symptoms.map(async (type) => {
        const q = query(
          collection(db, "symptoms"),
          where("type", "==", type.toLowerCase()),
          orderBy("day", "asc")
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const { day, level } = doc.data();
            const date = formatDate(day.toDate());
            const numericLevel = parseFloat(level);
            if (!isNaN(numericLevel)) {
              data.push({ date, level: numericLevel });
            } else {
              console.log("Invalid level value:", level);
            }
          });
        } else {
          console.log(`No documents found for ${type} symptom data.`);
        }
        return { type, data };
      });
    } catch (error) {
      console.error("Error fetching individual symptom data:", error);
    }
  };

  const calculateAverageSymptomData = async () => {
    try {
      const q = query(collection(db, "symptoms"), orderBy("day", "asc"));
      const querySnapshot = await getDocs(q);
      const dataByDate = {};

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const { day, level } = doc.data();
          const date = formatDate(day.toDate());
          if (!dataByDate[date]) {
            dataByDate[date] = { count: 0, totalLevel: 0 };
          }
          dataByDate[date].count++;
          dataByDate[date].totalLevel += parseFloat(level);
        });

        const averageData = Object.keys(dataByDate).map((date) => {
          const averageLevel =
            dataByDate[date].totalLevel / dataByDate[date].count;
          return { date, level: averageLevel };
        });

        setAverageGraphData(averageData);

        const highDays = averageData.filter(
          (dataPoint) => dataPoint.level >= 2.5
        );

        const uniqueHighDays = highDays.map((day) => day.date);
        const highLabels = await Promise.all(
          uniqueHighDays.map((date) => fetchMissingLabels(date))
        );

        const lowDays = averageData.filter(
          (dataPoint) => dataPoint.level < 2.5
        );
        const uniqueLowDays = lowDays.map((day) => day.date);
        const lowLabels = await Promise.all(
          uniqueLowDays.map((date) => fetchMissingLabels(date))
        );

        getLabelsMoreOnHighDays(
          countLabels(highLabels),
          countLabels(lowLabels)
        );
      } else {
        console.log("No documents found for average symptom data.");
      }
    } catch (error) {
      console.error("Error calculating average symptom data:", error);
    }
  };

  const fetchSymptomData = async () => {
    try {
      await fetchIndividualSymptomData();
      await calculateAverageSymptomData();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching symptom data:", error);
      setLoading(false);
    }
  };

  // Function to fetch missing labels for a given date
  const fetchMissingLabels = async (date) => {
    try {
      const foodCollections = ["breakfast", "lunch", "dinner", "snack"];
      const allLabels = [];
      for (const meal of foodCollections) {
        const dateDocRef = doc(db, "savedFoods", date);
        const foodCollectionRef = collection(
          dateDocRef,
          `${date}_${meal.toLowerCase()}`
        );
        const snapshot = await getDocs(foodCollectionRef);
        snapshot.forEach((doc) => {
          const labels = doc.data().missingLabels;
          allLabels.push(...labels);
        });
      }
      return allLabels;
    } catch (error) {
      console.error("Error fetching missing labels:", error);
    }
  };

  // Function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to count label occurrences
  function countLabels(labelsArr) {
    const labelCounts = {};
    labelsArr.forEach((dayLabels) => {
      dayLabels.forEach((label) => {
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      });
    });
    return labelCounts;
  }

  // Function to determine labels more on high days
  const getLabelsMoreOnHighDays = (highCounts, lowCounts) => {
    const labelsMoreOnHigh = [];
    Object.keys(highCounts).forEach((label) => {
      if (highCounts[label] > (lowCounts[label] || 0)) {
        labelsMoreOnHigh.push({ label, count: highCounts[label] });
      }
    });
    labelsMoreOnHigh.sort((a, b) => b.count - a.count);
    setTopLabels(labelsMoreOnHigh.slice(0, 2));
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSymptoms();
      await fetchSymptomData();
    };
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchSymptoms();
        await fetchSymptomData();
      };

      fetchData();
    }, [])
  );

  const countOccurrences = (arr) => {
    const counts = {};
    arr.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text style={styles.heading}>
        Foods consumed on high symptom days may have contained:
      </Text>
      <View style={styles.container}>
        {topLabels.map((food, index) => (
          <View key={index} style={styles.labelContainer}>
            <Text style={styles.text}>
              {food.label
                .replace(/_/g, " ")
                .replace(/\b(?:FREE)\b/g, "")
                .replace(/\b(?:LOW)\b/g, "HIGH")}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.heading}>Average Symptom Levels</Text>
      <GraphWithTooltip
        graphData={averageGraphData}
        fetchMissingLabels={fetchMissingLabels}
        countOccurrences={countOccurrences}
      />
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
