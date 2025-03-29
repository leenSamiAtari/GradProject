import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Button, Menu, Divider, Provider, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReportMissingOD = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API call
  const mockItems = [
    {
      id: 1,
      category: 'Laptop',
      description: 'MacBook Pro 2020 Space Gray',
      station: 'Main Station',
      date: '2024-03-15',
      student: { name: 'Ali Ahmad', id: '20191010' }
    },
    {
        id: 1,
        category: 'Laptop',
        description: 'MacBook Pro 2020 Space Gray',
        station: 'Main Station',
        date: '2024-03-15',
        student: { name: 'Ali Ahmad', id: '20191010' }
      },
    // Add more items...
  ];

  useEffect(() => {
    // Fetch items from your API
    // fetch('https://your-api/items').then(res => setItems(res.data))
    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesStation = selectedStation ? item.station === selectedStation : true;
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStation && matchesSearch;
  });

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Search and Filter Section */}
        <View style={styles.filterContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            left={<TextInput.Icon name="magnify" />}
          />

          <Menu
            anchor={
              <Button mode="outlined" style={styles.filterButton}>
                <MaterialCommunityIcons name="filter" size={20} />
                {selectedStation || 'Filter by Station'}
              </Button>
            }>
            <Menu.Item onPress={() => setSelectedStation('')} title="All Stations" />
            <Divider />
            <Menu.Item onPress={() => setSelectedStation('Main Station')} title="Main Station" />
            <Menu.Item onPress={() => setSelectedStation('North Gate')} title="North Gate" />
            {/* Add more stations */}
          </Menu>
        </View>

        {/* Items List */}
        {filteredItems.map(item => (
          <Card key={item.id} style={styles.itemCard}>
            <Card.Title 
              title={item.category}
              subtitle={`Reported at: ${item.station}`}
              left={(props) => <MaterialCommunityIcons {...props} name="bag-personal" size={24} />}
            />
            <Card.Content>
              <Text style={styles.itemText}>Description: {item.description}</Text>
              <Text style={styles.itemText}>Date Reported: {item.date}</Text>
              <Text style={styles.itemText}>Reported by: {item.student.name} (ID: {item.student.id})</Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                icon="message-text"
                onPress={() => navigation.navigate('Chat', { 
                  studentId: item.student.id,
                  itemId: item.id 
                })}
              >
                Message Student
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff'
  },
  filterButton: {
    width: 200
  },
  itemCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  itemText: {
    fontSize: 14,
    marginVertical: 4,
    color: '#555'
  }
});

export default ReportMissingOD;