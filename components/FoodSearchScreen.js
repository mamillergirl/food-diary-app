// FoodSearchScreen.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput,Text, TouchableOpacity, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';

const FoodSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      // Call Edamam Food API
      const appId = '383632ee';
      const appKey = '7e1fb8c14264704ea51920f7cb4179c1';
      const apiUrl = `https://api.edamam.com/api/food-database/v2/parser?ingr=${searchQuery}&app_id=${appId}&app_key=${appKey}`;

      axios.get(apiUrl)
        .then(response => {
          setSearchResults(response.data.hints);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleFoodItemClick = (food) => {
    setSelectedFood(food);
  };


  return (
    <SafeAreaView>
      <TextInput
        placeholder="Search for food..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      {selectedFood && (
        <View>
          <Text>Selected Food:</Text>
          <Text>{selectedFood.food.label}</Text>
          <Image
            source={{ uri: selectedFood.food.image}}
            style={{ width: 50, height: 50, marginRight: 10 }}
                />
        </View>
      )}
      <View>
        {searchResults.map((food) => (

      
          <TouchableOpacity
          key={food.food.foodId}
          onPress={() => handleFoodItemClick(food)}
        >
          <Text>{food.food.label}  :  {food.food.knownAs}</Text>
        </TouchableOpacity>
        ))}
      </View>
      
    </SafeAreaView>
  );
};

export default FoodSearchScreen;
