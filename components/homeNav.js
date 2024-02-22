import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from './Home';
import FoodSearchScreen from './FoodSearchScreen';

const Stack = createNativeStackNavigator();

function HomeNav() {
  return (

      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false}} component={Home} />
        <Stack.Screen name="FoodSearchScreen" component={FoodSearchScreen} />
      </Stack.Navigator>

  );
}

export default HomeNav;
