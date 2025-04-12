import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { Card, Button, Menu, Divider, Provider, TextInput, Icon, Modal, Portal} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReportMissingOD = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

   // Date formatting helpers
   const formatDate = (date) => {
    try {
      return date.toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const formatTime = (date) => {
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Unknown time';
    }
  };

  // Show details handler
  const showDetails = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };


  // Mock data - replace with API call
  const mockItems = [
    {
      id: 1,
      category: 'Hat',
      description: 'Nike, blue',
      station: 'shafa badran',
      dateLost: new Date('2025-03-08'),  
      timeApproximate: new Date('2025-03-08T09:00'),
      student: { name: 'Ali Ahmad', id: '20191010' },
      status: 'pending',
      locationType: 'bus',
      busNumber: 'AX-235',
      photos: ['https://example.com/wallet.jpg'],
      brand: 'Bellroy',
     containsItems: true,
     itemsInside: 'Credit cards, ID, €50 cash',
     uniqueFeatures: 'Monogram "JSD" on inside flap',
    },
    {
        id: 2,
        category: 'Laptop',
        description: 'MacBook Pro 2020  Gray',
        station: 'North bus station',
        dateLost: new Date('2025-03-15'),
        timeApproximate: new Date('2025-03-15T14:30'),
        student: { name: 'Leen Atari', id: '2135990' },
        status: 'pending',
        locationType: 'bus',
        busNumber: 'AX-235',
        photos: ['https://example.com/wallet.jpg'],
        brand: 'Bellroy',
        containsItems: true,
        itemsInside: 'Credit cards, ID, €50 cash',
        uniqueFeatures: 'Monogram "JSD" on inside flap',
      },
      {
        id: 3,
        category: 'Laptop',
        description: 'Lenovo',
        station: 'sweileh',
        dateLost: new Date('2025-04-03'),
        timeApproximate: new Date('2025-04-03T08:45'),
        student: { name: 'Yasmeen Sami', id: '2435667' },
        status: 'pending',
        locationType: 'bus',
        busNumber: 'AX-235',
        photos: ['https://example.com/wallet.jpg'],
        brand: 'Bellroy',
       containsItems: true,
      itemsInside: 'Credit cards, ID, €50 cash',
       uniqueFeatures: 'Monogram "JSD" on inside flap',
      },
      {
        id: 4,
        category: 'Glasses',
        description: 'black, scratch from the side',
        station: 'North bus station',
        dateLost: new Date('2025-02-15'),
        timeApproximate: new Date('2025-02-15T16:20'),
        student: { name: 'Osama Ahmad', id: '8900612' },
        status: 'pending',
        locationType: 'bus',
        busNumber: 'AX-235',
        photos: ['https://example.com/wallet.jpg'],
        brand: 'Bellroy',
        containsItems: true,
        itemsInside: 'Credit cards, ID, €50 cash',
        uniqueFeatures: 'Monogram "JSD" on inside flap',
      },
    // Add more items...
  ];

  useEffect(() => {
    // Fetch items from your API
    // fetch('https://your-api/items').then(res => setItems(res.data))
    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesStation = selectedStation ? 
      item.station.toLowerCase() === selectedStation.toLowerCase() : 
      true;
      
    const matchesSearch = searchQuery ?
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) :
      true;
  
    return matchesStation && matchesSearch;
  });

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Search and Filter Section */}
        <View style={styles.filterContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            underlineColorAndroid="transparent"
            selectionColor="#59B3F8"
            left={<TextInput.Icon name="magnify" />}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" style={styles.filterButton}  onPress={() => setMenuVisible(true)} contentStyle={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="filter" size={20} color="#59B3F8" />
                <Text style={styles.filterButtonText}>
                {selectedStation ? 
                `Station: ${selectedStation}` : 
                 'Filter'
                }
                </Text>
              </Button>
            }>
            <Menu.Item onPress={() => {
             setSelectedStation('');
             setMenuVisible(false);
             }} 
           title="All stations"
            />
            <Divider />
            <Menu.Item onPress={() => {
              setSelectedStation('North bus station');
              setMenuVisible(false);
            }} 
            title="North bus station"
            />
            <Menu.Item onPress={() => {
             setSelectedStation('shafa badran');
             setMenuVisible(false);
              }} 
             title="shafa badran"
            />
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
                style={styles.messageButton}
                onPress={() => navigation.navigate('Chat', { 
                  studentId: item.student.id,
                  itemId: item.id 
                })}
              >
                Message Student
              </Button>

              <Button 
            mode="contained-tonal" 
            onPress={() =>  showDetails(item)}
            style={styles.detailsButton}
          >
            <Icon source="information-outline" size={20} />
          </Button>
          </Card.Actions>
          </Card>
        ))}
      </ScrollView>
                     
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedItem && (
            <ScrollView style={styles.modalContent}>
              <Card>
                <Card.Title title="Detailed Information" />
                <Card.Content>
                  {/* Brand and Model */}
                  {(selectedItem.brand || selectedItem.model) && (
                    <View style={styles.detailRow}>
                      <Icon source="tag" size={20} color="#666" />
                      <Text style={styles.detailText}>
                        {[selectedItem.brand, selectedItem.model].filter(Boolean).join(' - ')}
                      </Text>
                    </View>
                  )}

                  {/* Contains Items */}
                  <View style={styles.detailRow}>
                    <Icon source="package-variant" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      Contains items: {selectedItem.containsItems ? 'Yes' : 'No'}
                    </Text>
                  </View>

                  {/* Items Inside */}
                  {selectedItem.containsItems && selectedItem.itemsInside && (
                    <View style={styles.detailRow}>
                      <Icon source="format-list-bulleted" size={20} color="#666" />
                      <Text style={styles.detailText}>
                        Items inside: {selectedItem.itemsInside}
                      </Text>
                    </View>
                  )}

                  {/* Unique Features */}
                  {selectedItem.uniqueFeatures && (
                    <View style={styles.detailRow}>
                      <Icon source="star" size={20} color="#666" />
                      <Text style={styles.detailText}>
                        Unique features: {selectedItem.uniqueFeatures}
                      </Text>
                    </View>
                  )}

                  {/* Date and Time */}
                  <View style={styles.detailRow}>
                    <Icon source="calendar-clock" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      Lost on: {formatDate(selectedItem.dateLost)} at{' '}
                      {formatTime(selectedItem.timeApproximate)}
                    </Text>
                  </View>

                  {/* Location Details */}
                  <View style={styles.detailRow}>
                    <Icon 
                      source={selectedItem.locationType === 'station' ? 'train' : 'bus'} 
                      size={20} 
                      color="#666" 
                    />
                    <Text style={styles.detailText}>
                      {selectedItem.locationType === 'station' 
                        ? `Station: ${selectedItem.station}`
                        : `Bus Number: ${selectedItem.busNumber}`}
                    </Text>
                  </View>

                  {/* Photos */}
                  {selectedItem.photos.length > 0 ? (
                    <View style={styles.photoSection}>
                      <Text style={styles.sectionTitle}>Photos:</Text>
                      <ScrollView horizontal>
                        {selectedItem.photos.map((uri, index) => (
                          <Image
                            key={index}
                            source={{ uri }}
                            style={styles.photoThumbnail}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <Text style={styles.noPhotos}>No photos available</Text>
                  )}
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => setModalVisible(false)}>
                    Close
                  </Button>
                </Card.Actions>
              </Card>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    width:350,
    height:55
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'center',
  },
  filterButton: {
    width: 150,
    height: 48,
    borderWidth: 1,
    borderColor: '#59B3F8',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButtonText: {
    color: '#59B3F8',
    fontSize: 16,
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
  },
  messageButton:{
    backgroundColor:'#59B3F8'
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%'
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    flexShrink: 1,
  },
  photoSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  noPhotos: {
    color: '#888',
    fontStyle: 'italic',
  },
  detailsButton: {
    marginRight: 8,
  },
});

export default ReportMissingOD;