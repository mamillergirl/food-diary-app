import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { firebase } from '../firebase';
import ChartComponent from './ChartComponent';

export default function Insights() {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const todoRef = firebase.firestore().collection('symptoms');

    const unsubscribe = todoRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { value } = doc.data();
        setGraphData(value);
        
        return;
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView>
  

      <ChartComponent/>
    </SafeAreaView>
  );
}
