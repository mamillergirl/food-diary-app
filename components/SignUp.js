import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebase'; // Import auth instance from firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import createUserWithEmailAndPassword from Firebase Auth
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const SignUp = ({screenChange}) => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // Track password visibility
    const [error, setError] = useState(null);

    const handleSignUp = async () => {
        try {
            if (!firstName || !lastName || !email || !password || !passwordValidation) {
                throw new Error('Please fill in all fields');
            }

            if (password !== passwordValidation) {
                throw new Error('Passwords do not match');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                createdAt: new Date(),
                firstName: firstName,
                lastName: lastName,
                email: email
            });

            Alert.alert('Success', 'You have successfully signed up.');
            navigation.navigate('Tabs');
        } catch (error) {
            console.error('Error signing up:', error.message);

        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>First Create Your Account</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.passwordInput, { flex: 1 }]} // Adjust the flex property
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                    <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={passwordValidation}
                onChangeText={setPasswordValidation}
                secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity style={styles.signup} onPress={handleSignUp}>
                <Text style={styles.signupText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => screenChange()}>
                <Text  style={styles.login}>Already have an account? Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F2F4F7',
    },
    title: {
        fontSize: 32,
        marginTop: '20%',
        fontWeight: 'bold',
        marginBottom: '10%',
        color: '#82B366',
    },
    subtitle: {
        fontSize: 16,
        color: '#6DA0D1',
        marginBottom: '25%',
    },
    input: {
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#A8A6A7',
        marginBottom: 10,
    },
    login: {
        marginTop: '5%',
        color: '#6DA0D1',
    },
    signup: {
        marginTop: '15%',
        backgroundColor: '#82B366',
        width: '70%',
        height: 45,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupText: {
        color: '#F2F4F7',
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '75%', 
    },
    passwordInput: {
        height: 40,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#A8A6A7',
    },
    passwordVisibilityButton: {
        padding: 10,
        marginLeft: 10, 
        backgroundColor: '#D8D8D8', 
        borderRadius: 5, 
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default SignUp;
