import React, { useState, useEffect } from "react";
import { SafeAreaView, Dimensions, Text, ScrollView, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { auth, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, orderBy, doc, getDoc, getDocs } from "firebase/firestore";
import GraphWithTooltip from "./GraphWithToolTip";

export default function IndividualGraphs() {

  const [individualGraphData, setIndividualGraphData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const countOccurrences = (arr) => {
    const counts = {};
    arr.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  };
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
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

        {Object.entries(individualGraphData).map(([type, data]) => (
         
          <React.Fragment key={type}>
              <Text style={styles.heading}>{type}</Text>
              <GraphWithTooltip
                graphData={data}
                fetchMissingLabels={fetchMissingLabels}
                countOccurrences={countOccurrences}
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
