import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({headingText}) => {
  

 const currentDate = new Date();

  // Format options for the date
  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  // Format the date string
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{headingText}</Text>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 24, // Adjust the font size as needed
    fontWeight: '700', // Ensure it's bold
    padding: '5%'

  },
  date: {
    padding: '5%',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default Header;
