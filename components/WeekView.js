import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { addDays, format } from 'date-fns';
import SymptomInput from './SymptomInput';
import MealInput from './MealInput';

const WeekView = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [mealDate, setMealDate] = useState(new Date().toISOString().split("T")[0]);
  const [symptomDate, setSymptomDate] = useState(new Date().toISOString().split("T")[0]);
  const currentDate = new Date();

  const startDate = addDays(currentDate, -6);


  const handleDayPress = (day) => {
    setSelectedDay(day);
    setMealDate();
    setSymptomDate(day.toISOString().split("T")[0]);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => {
          const day = addDays(startDate, index);
          const dayName = format(day, 'EE'); // Shortened day name
          const dayDate = format(day, 'dd');
          const isCurrentDay = day.toDateString() === currentDate.toDateString();
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay && selectedDay.toDateString() === day.toDateString() && styles.selectedDay]}
              onPress={() => handleDayPress(day)}>
              <Text style={styles.dayText}>{dayName}</Text>
              <View style={[styles.dateView, isCurrentDay && styles.currentDay]}>
                <Text style={[styles.dateText, selectedDay && selectedDay.toDateString() === day.toDateString() && styles.selectedDateText, isCurrentDay && styles.currentDateText]}>{dayDate}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView style={styles.subcontainer}>
        <Text style={styles.subheading}>{format(selectedDay, 'MMMM dd')} Meals</Text>
        <MealInput path={'Week'} date={format(selectedDay, 'yyyy-MM-dd')} headingText="Meal Input" />
        <Text style={styles.subheading}>Symptom Overview</Text>
        <SymptomInput date={format(selectedDay, 'yyyy-MM-dd')} headingText="Symptom Input" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dayButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 50,
  },
  subheading: {
    fontSize: 20,
    paddingLeft: '7%',
    fontWeight: '500'
  },
  subcontainer: {
    width: '100%',
    marginTop: 15,
  },
  selectedDay: {
    backgroundColor: '#d6e3ef',
  },
  dayText: {
    fontWeight: 'bold',
    color: '#6DA0D1',
  },
  dateText: {
    fontSize: 17,
  },
  currentDateText: {
    color: '#ffffff',
  },
  selectedDateText: {
    color: '#6DA0D1',
  },
  dateView: {
    padding: 3,
  },
  currentDay:{
    backgroundColor: '#6DA0D1',
    borderRadius: 15,
  }
});

export default WeekView;
