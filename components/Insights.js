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
      {/* <LineChart
        data={{
          labels: graphData.map((_, index) => index.toString()), // Using indices as labels
          datasets: [
            {
              data: graphData,
            },
          ],
        }}
        width={Dimensions.get('window').width }
        height={220}
        chartConfig={{
          backgroundColor: '#6DA0D1',
          backgroundGradientFrom: '#6DA0D1',
          backgroundGradientTo: '#6DA0D1',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      /> */}
      <ChartComponent/>
    </SafeAreaView>
  );
}
