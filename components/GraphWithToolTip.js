import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const GraphWithTooltip = ({
  graphData,
  fetchMissingLabels,
  countOccurrences,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState("Loading...");
  const [tooltipDate, setTooltipDate] = useState(null);

  const handleDotPress = async (clickedDate) => {
    setTooltipVisible(true);
    const labels = await fetchMissingLabels(clickedDate);
    let counts = countOccurrences(labels);
    setTooltipDate(clickedDate);
    setTooltipData(counts);

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
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipHeaderText}>
            Labels Missing on {tooltipDate} (Sorted by Count)
          </Text>
          <View style={styles.labelsContainer}>
            {tooltipData &&
              Object.entries(tooltipData)
                .sort(([, countA], [, countB]) => countB - countA)
                .map(([label, count]) => (
                  <Text key={label} style={styles.labelText}>
                    {label.replace(/_/g, " ")}
                  </Text>
                ))}
          </View>
          <TouchableOpacity onPress={() => setTooltipVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GraphWithTooltip;

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
  tooltipContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginTop: 10,
  },
  tooltipHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  labelsContainer: {
    marginBottom: 10,
  },
  labelText: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 14,
    textAlign: 'right',
  },
});
