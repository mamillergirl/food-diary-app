import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { firebase } from '../firebase';
import ChartComponent from './ChartComponent';

export default function Insights() {



  return (
    <SafeAreaView>
  

      <ChartComponent/>
    </SafeAreaView>
  );
}
