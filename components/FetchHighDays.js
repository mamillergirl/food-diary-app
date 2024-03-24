import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
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

export default function FetchHighDays() {
  const [averageGraphData, setAverageGraphData] = useState([]);
  const [individualGraphData, setIndividualGraphData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedDates, setFetchedDates] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);

  const handleDotPress = async (clickedDate) => {
    const labels = await fetchMissingLabels(clickedDate);
    let counts = countOccurrences(labels);
    setTooltipData(counts);
    setTooltipVisible(true);
  };

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

      // Update fetchedDates state with missing labels for the date
      return allLabels;
    } catch (error) {
      console.error("Error fetching missing labels:", error);
    }
  };

  // Function to fetch symptom data from Firestore
  const fetchSymptomData = async () => {
    setLoading(true);
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
          (dataPoint) => dataPoint.level >= 3
        );

        const uniqueHighDays = highDays.map((day) => day.date);
        uniqueHighDays.forEach(async (date) => {
          let allLabels = await fetchMissingLabels(date);
          setFetchedDates((prevState) => ({
            ...prevState,
            [date]: { allLabels },
          }));
        });
      } else {
        console.log("No documents found for average symptom data.");
      }

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

      Promise.all(promises).then((results) => {
        const newGraphData = {};
        results.forEach((result) => {
          if (result.data.length > 0) {
            newGraphData[result.type] = result.data;
          }
        });
        setIndividualGraphData(newGraphData);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching symptom data:", error);
      setLoading(false);
    }
  };

  // Function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function countOccurrences(arr) {
    const counts = {};
    arr.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  }

  useEffect(() => {
    if (symptoms.length > 0) {
      fetchSymptoms();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchSymptoms();
      fetchSymptomData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  function findTop4Foods(meals) {
    const foodOccurrences = {};
    Object.keys(meals).forEach((date) => {
      const labels = meals[date].allLabels;
      labels.forEach((label) => {
        foodOccurrences[label] = (foodOccurrences[label] || 0) + 1;
      });
    });
    const sortedFoods = Object.entries(foodOccurrences).sort(
      (a, b) => b[1] - a[1]
    );
    const top3Foods = sortedFoods.slice(0, 4); // Changed to slice top 3
    return top3Foods.map((food) => food[0]); // Return only food labels
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={[styles.heading, styles.title]}>
          Understanding Your Symptoms
        </Text>
        <Text style={styles.heading}>
          Common Missing Food Labels on Bad Symptom Days:
        </Text>
        <View style={styles.container}>
          {findTop4Foods(fetchedDates).map((food, index) => (
            <View key={index} style={styles.labelContainer}>
              <Text style={styles.text}>{food}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Average Symptom Levels</Text>
        <LineChart
          yLabelsOffset={10}
          formatXLabel={(date) => date.slice(8, 10)}
          data={{
            labels: averageGraphData.map((dataPoint) => dataPoint.date),
            datasets: [
              {
                data: averageGraphData.map((dataPoint) => dataPoint.level),
              },
            ],
          }}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={{
            backgroundColor: "#6DA0D1",
            backgroundGradientFrom: "#82B366",
            backgroundGradientTo: "#82B366",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffffff",
            },
          }}
          onDataPointClick={async ({ value, index }) => {
            const clickedDate = averageGraphData[index].date;
            handleDotPress(clickedDate);
          }}
          yAxisInterval={1}
          bezier
          fromZero
          style={styles.chart}
        />
        {tooltipVisible && (<View style={{backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Labels Missing on this Day (Sorted by Count)</Text>
          {Object.entries(tooltipData)
            .sort(([, countA], [, countB]) => countB - countA) 
            .map(([label, count]) => (
              <Text key={label}>{label}: {count}</Text>
            ))}
          <TouchableOpacity onPress={() => setTooltipVisible(false)}>
            <Text style={{ color: 'blue', marginTop: 5 }}>Close</Text>
          </TouchableOpacity>
        </View>

        )}

        {Object.entries(individualGraphData).map(([type, data]) => (
          <React.Fragment key={type}>
            <Text style={styles.heading}>{type}</Text>
            <LineChart
              formatXLabel={(date) => date.slice(8, 10)}
              data={{
                labels: data.map((dataPoint) => dataPoint.date),
                datasets: [
                  {
                    data: data.map((dataPoint) => dataPoint.level),
                  },
                ],
              }}
              width={Dimensions.get("window").width}
              height={220}
              chartConfig={{
                backgroundColor: "#6DA0D1",
                backgroundGradientFrom: "#82B366",
                backgroundGradientTo: "#82B366",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffffff",
                },
              }}
              yAxisInterval={1}
              bezier
              fromZero
              style={styles.chart}
              onDataPointClick={async ({ value, index }) => {
                const clickedDate = averageGraphData[index].date;
                const labels = await fetchMissingLabels(clickedDate);
                let counts = countOccurrences(labels);

                console.log(Object.entries(counts).sort((a, b) => b[1] - a[1]));
              }}
            />
          </React.Fragment>
        ))}
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
