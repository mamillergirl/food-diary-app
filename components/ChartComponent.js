import React, { useState, useEffect } from "react";
import { SafeAreaView, Dimensions, Text, ScrollView, StyleSheet} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { firebase, db } from "../firebase";
import { collection, query, where, orderBy, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";

export default function ChartComponent() {
  const [graphData, setGraphData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSymptoms = async () => {
    try {
      const docRef = doc(db, "user", "Xt9jJu2sHvNk6oSpbrMd");
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

  useEffect(() => {
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (symptoms.length > 0) {
      fetchSymptomData();
    }
  }, [symptoms]);

  const fetchSymptomData = () => {
    setLoading(true);
    const promises = symptoms.map(async (type) => {
      const q = query(
        collection(db, "symptoms"),
        where("type", "==", type.toLowerCase()),
        orderBy("day", "asc")
      );
      const querySnapshot = await getDocs(q);
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
      return { type, data };
    });

    Promise.all(promises).then((results) => {
      const newGraphData = {};
      results.forEach((result) => {
        if (result.data.length > 0) {
          newGraphData[result.type] = result.data;
        }
      });
      setGraphData(newGraphData);
      setLoading(false);
    });
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
      <ScrollView>
        {Object.entries(graphData).map(([type, data]) => (
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