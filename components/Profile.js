import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../firebase";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setUserData(data);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need notification permissions to send you reminders.");
      }
    };

    requestNotificationPermission();
  }, []);

const scheduleNotification = async () => {
  const currentHour = notificationTime.getHours();
  const currentMinute = notificationTime.getMinutes();

  // Check if the selected time is different from the current notification time
  if (currentHour !== new Date().getHours() || currentMinute !== new Date().getMinutes()) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Log Your Food!",
          body: "Don't forget to log your meals!",
        },
        trigger: {
          hour: currentHour,
          minute: currentMinute,
          repeats: true,
        },
      });
      console.log("Notification scheduled successfully");
      setModalVisible(false);
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  } else {
    // Alert user that the selected time is the same as the current time
    alert("Please select a different time for the notification.");
  }
};


  const handleEditEliminationGoals = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseProfileModal = async () => {
    if (newFirstName.length >= 1 && newLastName.length >= 1) {
      {
        setFirstName(newFirstName);
        setLastName(newLastName);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          firstName: newFirstName,
          lastName: newLastName,
        });
        setProfileModalVisible(false);
      }
    }
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
        <Text style={styles.heading}>
          {firstName} {lastName}
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Text style={styles.setting}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.setting}>Edit Elimination Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditEliminationGoals}>
          <Text style={styles.setting}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            auth.signOut();
            navigation.navigate("Auth Screen");
          }}
        >
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Profile Information</Text>
            <TextInput
              style={styles.input}
              placeholder={firstName}
              onChangeText={setNewFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder={lastName}
              onChangeText={setNewLastName}
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setProfileModalVisible(false)}
                title="Cancel"
              />
              <Button onPress={handleCloseProfileModal} title="Save" />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set Daily Notification Time</Text>
            <DateTimePicker
              value={notificationTime}
              mode="time"
              display="clock"
              onChange={handleTimeChange}
            />

            <View style={styles.buttonContainer}>
              <Button onPress={handleCloseModal} title="Cancel" />
              <Button onPress={scheduleNotification} title="Set Time" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  input: {
    width: "75%",
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#A8A6A7",
    marginBottom: 10,
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
  logout: {
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
