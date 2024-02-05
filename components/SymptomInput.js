import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

const SymptomInput = ({ headingText, color }) => {
  return (
    <View style={styles.container}>
      <Card color='#FF655B' type="Diarrhea" category="Symptom" />
      <Card color='#FF655B' type="Bloating" category="Symptom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%',
  },
});

export default SymptomInput;
