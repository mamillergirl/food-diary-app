import React, { useState, useContext} from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import SignUp from './SignUp';
import SignIn from './SignIn';

const AuthScreen = () => {
 
    const [signUp, setSignUp] = useState(true);


    return (
        <>
        {signUp ? (
            <SignUp screenChange={() => setSignUp(false)} />
        ) : (
           
            <SignIn screenChange={() => setSignUp(true)} />
        )}
        </>
    );
};

export default AuthScreen;
