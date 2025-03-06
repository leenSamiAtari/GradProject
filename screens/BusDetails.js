import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  TouchableOpacity,
  TextInput,
  Alert,
}from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusDetails = ({ route }) => {
  const { scheduleId } = route.params;
  const [busDetails, setBusDetails] = useState([]);

  
  const saveBusDetailsToDatabase = async (busDetails) => {
    try {
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduleId,
          busDetails,
        }),
      });

      if (response.ok) {
        console.log('Bus details saved successfully');
      } else {
        console.error('Failed to save bus details');
      }
    } catch (error) {
      console.error('Error saving bus details:', error);
    }
  };

  useEffect(() => {
    const loadBusDetails = async () => {
      try {
        const storedData = await AsyncStorage.getItem(busData-$,{scheduleId});
        if (storedData) {
          const busData = JSON.parse(storedData); 
          setBusDetails(busData);

          
          saveBusDetailsToDatabase(busData); 
        }
      } catch (error) {
        console.log('Error loading bus details:', error);
      }
    };
    loadBusDetails();
  }, [scheduleId]);

  if (busDetails.length === 0) {
    return (
      <View style={styles.container}>
         {/* Top Bar */}
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
        <Text style={styles.noDataText}>No details available for this schedule.</Text>
        {/* Bottom Navigation */}
                    <View style={styles.bottomNav}>
                      <TouchableOpacity onPress={() => navigation.navigate("operator")} style={styles.navItem}>
                        <Icon name="home-outline" size={25} color="#59B3F8" />
                        <Text style={styles.navText}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate("BusSchedule")} style={styles.navItem}>
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
  }

  return (
    <View style={styles.container}>
       {/* Top Bar */}
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
      <Text style={styles.header}>Bus Details</Text>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Bus Number</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Driver</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Arrival time</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Departure time</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Driver email</Text>
          </View>
          {busDetails.map((bus, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{bus.number_of_bus}</Text>
              <Text style={styles.tableCell}>{bus.Driver_name}</Text>
              <Text style={styles.tableCell}>{bus.Arrival_Time}</Text>
              <Text style={styles.tableCell}>{bus.Departure_Time}</Text>
              <Text style={styles.tableCell}>{bus.Driver_Email}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
       {/* Bottom Navigation */}
       <View style={styles.bottomNav}>
                      <TouchableOpacity onPress={() => navigation.navigate("operator")} style={styles.navItem}>
                        <Icon name="home-outline" size={25} color="#59B3F8" />
                        <Text style={styles.navText}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate("BusSchedule")} style={styles.navItem}>
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
    padding: 20,
    backgroundColor: '#f8ffff',
    paddingTop: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50', 
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 25,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1.4,         
    borderColor: '#DDDDDD',  
    borderRadius: 5,        
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: '#DDDDDD',
    paddingBottom: 8,
    marginBottom: 12,
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#2C3E50', 
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333', 
    fontWeight: '400',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
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

export default BusDetails;
