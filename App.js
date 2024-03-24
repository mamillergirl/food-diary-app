import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "./firebase";
import AuthScreen from "./components/AuthScreen";
import Tabs from "./components/Tabs";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
     <Stack.Navigator
     initialRouteName={auth.currentUser ? "Tabs" : "Auth Screen"}
    > 
        <Stack.Screen
          name="Auth Screen"
          options={{ headerShown: false }}
          component={AuthScreen}
        />
        <Stack.Screen
          name="Tabs"
          options={{ headerShown: false }}
          component={Tabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
