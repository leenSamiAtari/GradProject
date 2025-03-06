import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';  


const ReportMissing = () => {
  const [itemType, setItemType] = useState("My Item");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!description.trim() || !location.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert(
      "Report Submitted",
      `Item Type: ${itemType}\nDescription: ${description}\nLocation: ${location}`
    );

    // Clear the form
    setDescription("");
    setLocation("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Lost or Found Item</Text>

      <Text style={styles.label}>Item Type</Text>
      <Picker
        selectedValue={itemType}
        onValueChange={(value) => setItemType(value)}
        style={styles.picker}
      >
        <Picker.Item label="My Item" value="My Item" />
        <Picker.Item label="Other Person's Item" value="Other Person's Item" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Describe the item..."
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Where was it lost or found?"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#59B3F8",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ReportMissing;
