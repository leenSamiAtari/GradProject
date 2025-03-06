import React, { useState, useEffect } from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const busSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityMenu, setShowCityMenu] = useState(false);
  const navigation = useNavigation();
 
  const cities = ['Amman', 'Zarqa'];

  const loadSchedules = async () => {
    try {
      const url = selectedCity === 'Amman'
        ?'https://fe20-2a01-9700-80de-2d00-5441-84a-9026-914.ngrok-free.app/amman/Bus_Stations'
        : 'https://fe20-2a01-9700-80de-2d00-5441-84a-9026-914.ngrok-free.app/zarqa/Bus_Stations';
      
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched data from database:", data);

      // Save fetched data to local storage
      await AsyncStorage.setItem(`Schedules_${selectedCity}`, JSON.stringify(data));
      setSchedules(data);
    } catch (error) {
      console.error('Failed to fetch schedules from database:', error);
      Alert.alert('Error', 'Failed to load schedules from the database. Loading from local storage.');
      loadSchedulesFromStorage();
    }
  };

  const loadSchedulesFromStorage = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem(`Schedules_${selectedCity}`);
      console.log("Loaded data from local storage:", storedSchedules);

      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      } else {
        console.log("No data found for the selected city in local storage.");
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error loading schedules from storage:', error);
      Alert.alert('Error', 'Failed to load schedules from local storage.');
    }
  };

  useEffect(() => {
    if (selectedCity) {
      console.log("City selected:", selectedCity);
      loadSchedules();
    }
  }, [selectedCity]);

  const navigateToBusSituation = (scheduleId) => {
    navigation.navigate('BusDetails', { scheduleId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>HUrry</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Icon name="bell-outline" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ marginLeft: 15 }}>
            <Icon name="account-circle-outline" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Bus Schedules</Text>

      <TouchableOpacity
        style={styles.cityButton}
        onPress={() => setShowCityMenu(!showCityMenu)}
      >
        <Text style={styles.cityButtonText}>Select a City: {selectedCity}</Text>
      </TouchableOpacity>

      {showCityMenu && (
        <View style={styles.cityMenu}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={styles.cityMenuItem}
              onPress={() => {
                setSelectedCity(city);
                setShowCityMenu(false);
              }}
            >
              <Text style={styles.cityMenuText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <Text style={styles.text}>
                <Text style={styles.label}>Bus Station Name:</Text> {schedule.nameOfBusStation}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Number of Buses:</Text> {schedule.numberOfBuses}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Operator Name:</Text> {schedule.operatorEmail || 'Unknown'}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Operator Email:</Text> {schedule.operatorName || 'Unknown'}
              </Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigateToBusSituation(schedule.id)}
              >
                <Text style={styles.linkText}>View Bus</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noSchedules}>No schedules available, select a city</Text>
        )}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", {role:'STUDENT'})} style={styles.navItem}>
          <Icon name="home-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("busSchedule")} style={styles.navItem}>
          <Icon name="calendar-clock" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Feedback")} style={styles.navItem}>
          <Icon name="comment-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ContactUs")} style={styles.navItem}>
          <Icon name="alert-circle-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Missing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8ffff',
    paddingTop: 0,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
    marginTop: 20,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333333',
  },
  label: {
    fontWeight: 'bold',
    color: '#555555',
  },
  linkButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#59B3F8',
    alignItems: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  noSchedules: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888888',
    marginTop: 25,
  },
  cityButton: {
    padding: 10,
    backgroundColor: '#59B3F8',
    borderRadius: 8,
    marginBottom: 10,
  },
  cityButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cityMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 5,
    borderWidth: 1.4,         
    borderColor: '#DDDDDD',  
    borderRadius: 5,        
    borderStyle: 'solid',
  },
  cityMenuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  cityMenuText: {
    fontSize: 16,
    color: '#333333',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#59B3F8",
    paddingVertical: 10,
    paddingHorizontal:20,
    marginHorizontal: -20,
  },
 
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 58,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: -20,
    marginTop: 'auto', 
    marginVertical: 0, 
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#59B3F8',
    marginTop: 5,
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop:150,
  },
  menuItem: {
    width: "45%", // Adjusted for a grid layout
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    color: "#666",
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

export default busSchedule;