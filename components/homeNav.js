import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from './Home';
import FoodSearchScreen from './FoodSearchScreen';
import SymptomSelector from './SymptomSelector';

const Stack = createNativeStackNavigator();

function HomeNav() {
  return (

      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false}} component={Home} />
        <Stack.Screen name="Search Foods" component={FoodSearchScreen} />
        <Stack.Screen name="SymptomSelector" component={SymptomSelector} />
      </Stack.Navigator>

  );
}

export default HomeNav;
