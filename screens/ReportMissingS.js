import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image} from 'react-native';
import { Button, TextInput, RadioButton, Text, Card, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportMissingS = ({ navigation, route }) => {
  const [form, setForm] = useState({
    category: '',
    description: '',
    brand: '',
    model: '',
    containsItems: false,
    itemsInside: '',
    uniqueFeatures: '',
    dateLost: new Date(),
    timeApproximate: '',
    locationType: 'station',
    station: '',
    busNumber: '',
    photos: [],
    isEditing: false
  });

  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable photo library access in settings');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setForm(prev => ({
          ...prev,
          photos: [...prev.photos, result.assets[0].uri]
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        dateLost: form.dateLost.toISOString(),
        photos: form.photos.join(',')
      };

      // Replace with your actual API endpoint
      const response = await fetch('https://your-spring-boot-api.com/items', {
        method: form.isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          `Item ${form.isEditing ? 'Updated' : 'Reported'} Successfully!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Category Selection */}
          <Text style={styles.label}>Item Category :</Text>
          <Picker
  selectedValue={form.category}
  onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
  style={styles.picker}
  dropdownIconColor="#59B3F8"
>
  <Picker.Item label="Select Item Category" value="" />
  <Picker.Item label="Phone" value="phone" />
  <Picker.Item label="Laptop" value="laptop" />
  <Picker.Item label="iPad" value="iPad" />
  <Picker.Item label="Bag/Backpack" value="bag/backpack" />
  <Picker.Item label="Wallet" value="wallet" />
  <Picker.Item label="Keys" value="keys" />
  <Picker.Item label="Purse/Handbag" value="purse/handbag" />
  <Picker.Item label="Clothing Item" value="clothing" />
  <Picker.Item label="Headphones/Earphones" value="headphones" />
  <Picker.Item label="Charger" value="charger" />
  <Picker.Item label="Hat/Cap" value="hat" />
  <Picker.Item label="Glasses" value="glasses" />
  <Picker.Item label="Academic Items" value="academic" />
  <Picker.Item label="Other" value="other" />
</Picker>
   

          {/* Conditional Fields */}
          {['phone', 'laptop', 'iPad'].includes(form.category) && (
            <>
              <TextInput
                label="Brand"
                value={form.brand}
                onChangeText={text => setForm({ ...form, brand: text })}
                style={styles.input}
              />
              
            </>
          )}

          {['bag/backpack', 'wallet', 'purse/handbag'].includes(form.category) && (
            <>
              <RadioButton.Group
                value={form.containsItems}
                onValueChange={value => setForm({ ...form, containsItems: value })}>
                <View style={styles.radioGroup}>
                  <Text>Did it contain any items?</Text>
                  <RadioButton.Item label="Yes" value={true} />
                  <RadioButton.Item label="No" value={false} />
                </View>
              </RadioButton.Group>

              {form.containsItems && (
                <TextInput
                  label="List items inside"
                  multiline
                  value={form.itemsInside}
                  onChangeText={text => setForm({ ...form, itemsInside: text })}
                  style={styles.input}
                />
              )}
            </>
          )}

          {/* Common Fields */}
          <TextInput
            label="Description"
            multiline
            value={form.description}
            onChangeText={text => setForm({ ...form, description: text })}
            placeholder="Color, Shape, Size, etc."
            style={styles.input}
          />

          <TextInput
            label="Unique Features"
            multiline
            value={form.uniqueFeatures}
            onChangeText={text => setForm({ ...form, uniqueFeatures: text })}
            style={styles.input}
            placeholder="Scratches, stickers, engravings, etc."
          />

          {/* Date/Time Pickers */}
          <Text style={styles.label}>Date Lost :</Text>
          <DateTimePicker
            value={form.dateLost}
            mode="date"
            onChange={(_, date) => setForm({ ...form, dateLost: date || form.dateLost })}
          />

          <Text style={styles.label}>Approximate Time :</Text>
          <View style={styles.timeContainer}>
            <DateTimePicker
              value={form.dateLost}
              mode="time"
              onChange={(_, date) => setForm({ ...form, dateLost: date || form.dateLost })}
            />
          </View>

          {/* Location Selection */}
          <Text style={styles.label}>Location :</Text>
          <RadioButton.Group
            value={form.locationType}
            onValueChange={value => setForm({ ...form, locationType: value })}>
            <View style={styles.radioGroup}>
              <RadioButton.Item label="Station" value="station" />
              <RadioButton.Item label="Bus" value="bus" />
            </View>
          </RadioButton.Group>

          {form.locationType === 'station' ? (
            <Picker
            selectedValue={form.station}
            onValueChange={(itemValue) => setForm({ ...form, station: itemValue })}
            style={styles.picker}
            dropdownIconColor="#59B3F8"
          >
            <Picker.Item label="Select Station" value="" />
            <Picker.Item label="Main Station" value="main" />
            <Picker.Item label="North Gate" value="north" />
            <Picker.Item label="Science Building" value="science" />
            <Picker.Item label="Library" value="library" />
            <Picker.Item label="Dormitory" value="dormitory" />
          </Picker>
          ) : (
            <TextInput
              label="Bus Number"
              value={form.busNumber}
              onChangeText={text => setForm({ ...form, busNumber: text })}
              style={styles.input}
            />
          )}

          {/* Photo Upload */}
          <Text style={styles.note}>Adding photos increases match chances by 60%!</Text>
          <View style={styles.photoContainer}>
            {form.photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} />
                <IconButton
                icon="close"
                size={25}
                onPress={() => {
                const newPhotos = [...form.photos];
                newPhotos.splice(index, 1);
                setForm({ ...form, photos: newPhotos });
               }}
               style={styles.deletePhoto}
                  />
                <IconButton
                  onPress={async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    
                    if (status !== 'granted') {
                      Alert.alert('Permission required', 'Please allow photo access');
                      return;
                    }
                
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.All,
                      allowsEditing: true,
                      quality: 0.8,
                    });
                
                    if (!result.canceled) {
                      setForm({ ...form, photos: [...form.photos, result.assets[0].uri] });
                    }
                  }}
                  
                />
              </View>
            ))}
            <IconButton
              icon="camera-plus"
              size={40}
              onPress={handlePhotoUpload}
              style={styles.addPhoto}
            />
          </View>

          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.submitButton}>
            {form.isEditing ? 'Update Report' : 'Submit Report'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(89, 179, 248, 0.09)',

  },
  label: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    marginVertical: 8,
    borderRadius: 25,
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff"
    },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  photoWrapper: {
    position: 'relative',
    margin: 4,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deletePhoto: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 0,
    borderRadius: 0,
    borderBottomLeftRadius: 8,
  },
  addPhoto: {
    alignSelf: 'flex-start',
    margin: 4,
  },
  note: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    marginVertical: 20,
    backgroundColor: "#59B3F8"
  },
});

export default ReportMissingS;