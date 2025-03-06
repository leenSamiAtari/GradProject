import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications (mocked or from an API)
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const mockNotifications = [
          {
            id: 1,
            title: "General Announcement",
            message: "The bus service will be delayed by 10 minutes today.",
            type: "general", // "general" or "emergency"
          },
          {
            id: 2,
            title: "Emergency Alert",
            message: "There is a road blockage near the main gate. Buses are rerouted.",
            type: "emergency", // "general" or "emergency"
          },
        ];
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.type === "emergency" && styles.emergencyCard]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      {item.type === "emergency" && (
        <TouchableOpacity
          style={styles.alertButton}
          onPress={() => Alert.alert("Emergency", "Please follow safety instructions.")}
        >
          <Text style={styles.alertButtonText}>Acknowledge</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8ffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  emergencyCard: {
    backgroundColor: "#ff4d4d",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  alertButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#59B3F8",
  },
});

export default Notifications;
