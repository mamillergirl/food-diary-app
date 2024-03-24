import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const CorrelationAnalysis = () => {
  // Sample data
  const [foods] = useState(['Dairy', 'Fruit', 'Vegetables', 'Meat']);
  const [nausea] = useState([3, 2, 1, 2]); // Severity of nausea (1-5 scale) associated with each food
  const [diarrhea] = useState([4, 2, 1, 3]); // Severity of diarrhea (1-5 scale) associated with each food
  const [correlationCoefficient, setCorrelationCoefficient] = useState(null);

  // Calculate rank
  const rank = arr => arr.map((val, i) => ({
    value: val,
    rank: arr.slice().sort((a, b) => a - b).indexOf(val) + 1
  }));

  // Calculate Spearman rank correlation coefficient
  const spearmanCorrelation = (arr1, arr2) => {
    const rankedArr1 = rank(arr1);
    const rankedArr2 = rank(arr2);
    const n = arr1.length;
    
    const sumDiffSquared = rankedArr1.reduce((acc, curr, i) => {
      const diff = curr.rank - rankedArr2[i].rank;
      return acc + diff * diff;
    }, 0);
  
    const coefficient = 1 - (6 * sumDiffSquared) / (n * (n * n - 1));
  
    return coefficient;
  };

  useEffect(() => {
    const coefficient = spearmanCorrelation(nausea, diarrhea);
    setCorrelationCoefficient(coefficient);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Correlation Analysis</Text>
      {correlationCoefficient !== null ? (
        <Text style={{ fontSize: 16 }}>
          Spearman rank correlation coefficient: {correlationCoefficient.toFixed(2)}
        </Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default CorrelationAnalysis;
