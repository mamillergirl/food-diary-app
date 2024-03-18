import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from 'expo-notifications';

const Profile = () => {
  const [firstName, setFirstName] = useState("Marisa");
  const [lastName, setLastName] = useState("Miller");
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need notification permissions to send you reminders.');
      }
    };
  
    requestNotificationPermission();
  }, []);

  const scheduleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Log Your Food!',
          body: "Don't forget to log your meals!",
        },
        trigger: {
          hour: notificationTime.getHours(),
          minute: notificationTime.getMinutes(),
          repeats: true,
        },
      });
      console.log("Notification scheduled successfully");
      setModalVisible
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const handleEditEliminationGoals = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || notificationTime;
    setShowTimePicker(false);
    setNotificationTime(currentTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.profile}></View>
        <Text style={styles.heading}>{firstName} {lastName}</Text>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity >
          <Text style={styles.setting}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity >
          <Text style={styles.setting}>Edit Elimination Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditEliminationGoals}>
          <Text style={styles.setting}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity >
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for setting notification time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set Notification Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text>{notificationTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={notificationTime}
                mode="time"
                display="clock"
                onChange={handleTimeChange}
              />
            )}
            <Button onPress={scheduleNotification} title="Set Time" />
            <Button onPress={handleCloseModal} title="Cancel" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    padding: 16,
  },
  topContainer: {
    alignItems: "center",
  },
  profile: {
    backgroundColor: "#C4C4C4",
    height: 130,
    width: 130,
    borderRadius: 100,
    marginTop: "20%",
  },
  heading: {
    fontSize: 20,
    marginTop: 16,
    color: "#6DA0D1",
    marginBottom: "15%",
  },
  settingsContainer: {
    flexDirection: "column",
    marginLeft: "25%",
  },
  setting: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 15,
  },
  logout : {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6DA0D1",
    marginTop: "70%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
});

export default Profile;
