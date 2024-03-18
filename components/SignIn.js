import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";

const SignIn = ({ screenChange }) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);

    const handleSignIn = async () => {
        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            await signInWithEmailAndPassword(auth, email, password);

            navigation.navigate('Tabs');


        } catch (error) {
            console.error('Error signing in:', error.message);
            setError(error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Enter your email and password</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.passwordInput, { flex: 1 }]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                    <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInText}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => screenChange()}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
    signInButton: {
        marginTop: '15%',
        backgroundColor: '#82B366',
        width: '70%',
        height: 45,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInText: {
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
    signUpText: {
        marginTop: 20,
        color: '#6DA0D1',
    },
});

export default SignIn;
