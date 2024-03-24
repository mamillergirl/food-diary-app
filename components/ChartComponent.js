import React, { useState, useEffect } from "react";
import { SafeAreaView, Dimensions, Text, ScrollView, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { auth, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, orderBy, doc, getDoc, getDocs } from "firebase/firestore";

export default function ChartComponent() {
  const [averageGraphData, setAverageGraphData] = useState([]);
  const [individualGraphData, setIndividualGraphData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchSymptomData = async () => {
  setLoading(true);
  try {
    // Fetch average symptom data
    const q = query(
      collection(db, "symptoms"),
      orderBy("day", "asc")
    );
    const querySnapshot = await getDocs(q);
    const dataByDate = {};

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const { day, level } = doc.data();
        const date = day.toDate().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        if (!dataByDate[date]) {
          dataByDate[date] = { count: 0, totalLevel: 0 };
        }
        dataByDate[date].count++;
        dataByDate[date].totalLevel += parseFloat(level);
      });

      const averageData = Object.keys(dataByDate).map((date) => {
        const averageLevel = dataByDate[date].totalLevel / dataByDate[date].count;
        return { date, level: averageLevel };
      });

      setAverageGraphData(averageData);
    } else {
      console.log("No documents found for average symptom data.");
    }

    // Fetch individual symptom data
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
          const date = day.toDate().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
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
      console.log(promises);
      setIndividualGraphData(newGraphData);
      setLoading(false);
    });
  } catch (error) {
    console.error("Error fetching symptom data:", error);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (symptoms.length > 0) {
      fetchSymptomData();
    }
  }, [symptoms]);
  
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

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Render average symptom level chart */}
        <Text style={styles.heading}>Average Symptom Levels</Text>
        <LineChart
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
            decimalPlaces: 2,
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
        />

        {/* Render individual symptom level charts */}
        {Object.entries(individualGraphData).map(([type, data]) => (
          <React.Fragment key={type}>
            <Text style={styles.heading}>{type}</Text>
            <LineChart
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
                decimalPlaces: 2,
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
            />
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
