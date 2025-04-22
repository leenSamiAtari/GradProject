import React from 'react';
import { View, Text, Button } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome, Admin!</Text>
      <Button
        title="View Reports"
        onPress={() => navigation.navigate('AdminReports')} // Add more screens later
      />
      <Button
        title="Logout"
        onPress={() => navigation.navigate('Welcome')} // Redirect to initial screen
      />
    </View>
  );
};

export default AdminDashboard;