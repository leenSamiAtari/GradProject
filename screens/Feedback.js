import React, { useState } from "react";
import { View, Text, TextInput,  TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';  


const Feedback = () => {
  const [type, setType] = useState("Trip");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Please provide your feedback.");
      return;
    }
    alert(`Feedback submitted for ${type}: ${feedback}`);
    setFeedback("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give Feedback</Text>
      <Text style={styles.label}>Select Feedback Type</Text>
      <Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue)} style={styles.picker}>
        <Picker.Item label="Trip" value="Trip" />
        <Picker.Item label="Driver" value="Driver" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
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
    height: 100,
    textAlignVertical: "top",
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

export default Feedback;
