import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const GraphWithTooltip = ({ graphData, fetchMissingLabels, countOccurrences }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);

  const handleDotPress = async (clickedDate) => {
    const labels = await fetchMissingLabels(clickedDate);
    let counts = countOccurrences(labels);
    setTooltipData(counts);
    setTooltipVisible(true);
  };

  return (
    <View>
      <LineChart
        yLabelsOffset={10}
        formatXLabel={(date) => date.slice(8, 10)}
        data={{
          labels: graphData.map((dataPoint) => dataPoint.date),
          datasets: [
            {
              data: graphData.map((dataPoint) => dataPoint.level),
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
        onDataPointClick={async ({ index }) => {
          const clickedDate = graphData[index].date;
          handleDotPress(clickedDate);
        }}
        yAxisInterval={1}
        bezier
        fromZero
        style={styles.chart}
      />
      {tooltipVisible && (
        <View style={{ position: 'absolute', backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
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
    </View>
  );
};

export default GraphWithTooltip;
