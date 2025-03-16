/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BUS_STATIONS } from './Stations';

const COLORS = {
  primary: '#2F80ED',
  success: '#27AE60',
  error: '#EB5757',
  background: '#F8F9FA',
  text: '#2D3436',
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const ClosestBusStation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [closestStation, setClosestStation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState(null);

  const calculateClosestStation = (latitude, longitude) => {
    if (!BUS_STATIONS?.length) {
      setErrorMsg('No bus stations available');
      setStatus('error');
      return;
    }

    let nearest = BUS_STATIONS[0];
    let minDistance = getDistance(latitude, longitude, nearest.latitude, nearest.longitude);

    BUS_STATIONS.forEach((station) => {
      const distance = getDistance(latitude, longitude, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    setClosestStation({ ...nearest, distance: minDistance });
    calculateMapRegion(latitude, longitude, nearest.latitude, nearest.longitude);
  };

  const calculateMapRegion = (userLat, userLon, stationLat, stationLon) => {
    const latDelta = Math.abs(userLat - stationLat) * 3;
    const lonDelta = Math.abs(userLon - stationLon) * 3;
    
    setRegion({
      latitude: (userLat + stationLat) / 2,
      longitude: (userLon + stationLon) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  };

  const handleRefresh = async () => {
    setStatus('loading');
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      calculateClosestStation(latitude, longitude);
      setStatus('success');
    } catch (error) {
      setErrorMsg('Failed to refresh location. Please try again.');
      setStatus('error');
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      handleRefresh();
    } else {
      setErrorMsg('Location permission is required to find nearby stations.');
      setStatus('error');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        handleRefresh();
      } else {
        setStatus('permission-required');
      }
    })();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Finding your location...</Text>
          </View>
        );

      case 'permission-required':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="location-off" size={60} color={COLORS.text} />
            <Text style={styles.errorText}>Location permission required</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={60} color={COLORS.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success':
        if (!closestStation || !userLocation) {
          return (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Calculating nearest station...</Text>
            </View>
          );
        }

        return (
          <>
            <MapView style={styles.map} region={region}>
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor={COLORS.primary}
              />
              <Marker
                coordinate={{
                  latitude: closestStation.latitude,
                  longitude: closestStation.longitude,
                }}
                title={closestStation.name}
                description={`${closestStation.distance.toFixed(2)} km away`}
                pinColor={COLORS.success}
              />
            </MapView>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialIcons name="directions-bus" size={24} color={COLORS.success} />
                <Text style={styles.infoTitle}>Closest Station</Text>
              </View>
              
              <Text style={styles.stationName}>{closestStation.name}</Text>
              
              <View style={styles.distanceContainer}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color={COLORS.text} />
                <Text style={styles.distanceText}>
                  {closestStation.distance.toFixed(2)} km away
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${closestStation.latitude},${closestStation.longitude}`
                )}
              >
                <MaterialCommunityIcons name="directions" size={20} color="white" />
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={20} color="white" />
              <Text style={styles.buttonText}>Refresh Location</Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    height: 300,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  stationName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  permissionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    justifyContent: 'center',
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
  },
});

export default ClosestBusStation;*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const BACKEND_URL = 'https://your-springboot-backend.com/api/nearest-station';

const COLORS = {
  primary: '#2F80ED',
  success: '#27AE60',
  error: '#EB5757',
  background: '#F8F9FA',
  text: '#2D3436',
};

const ClosestBusStation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [closestStation, setClosestStation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState(null);

  const calculateMapRegion = (userLat, userLon, stationLat, stationLon) => {
    const latDelta = Math.abs(userLat - stationLat) * 3;
    const lonDelta = Math.abs(userLon - stationLon) * 3;
    
    setRegion({
      latitude: (userLat + stationLat) / 2,
      longitude: (userLon + stationLon) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  };

  const findNearestStation = async (latitude, longitude) => {
    try {
      const response = await fetch(`${BACKEND_URL}?lat=${latitude}&lng=${longitude}`);
      if (!response.ok) throw new Error('Failed to find station');
      const data = await response.json();
      setClosestStation(data);
      calculateMapRegion(latitude, longitude, data.latitude, data.longitude);
      setStatus('success');
    } catch (error) {
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  const handleRefresh = async () => {
    setStatus('loading');
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      await findNearestStation(latitude, longitude);
    } catch (error) {
      setErrorMsg('Failed to refresh location. Please try again.');
      setStatus('error');
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      handleRefresh();
    } else {
      setErrorMsg('Location permission is required to find nearby stations.');
      setStatus('error');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        handleRefresh();
      } else {
        setStatus('permission-required');
      }
    })();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Finding your location...</Text>
          </View>
        );

      case 'permission-required':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="location-off" size={60} color={COLORS.text} />
            <Text style={styles.errorText}>Location permission required</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={60} color={COLORS.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success':
        if (!closestStation || !userLocation) {
          return (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Finding nearest station...</Text>
            </View>
          );
        }

        return (
          <>
            <MapView style={styles.map} region={region}>
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor={COLORS.primary}
              />
              <Marker
                coordinate={{
                  latitude: closestStation.latitude,
                  longitude: closestStation.longitude,
                }}
                title={closestStation.name}
                description={`${closestStation.distance.toFixed(2)} km away`}
                pinColor={COLORS.success}
              />
            </MapView>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialIcons name="directions-bus" size={24} color={COLORS.success} />
                <Text style={styles.infoTitle}>Closest Station</Text>
              </View>
              
              <Text style={styles.stationName}>{closestStation.name}</Text>
              
              <View style={styles.distanceContainer}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color={COLORS.text} />
                <Text style={styles.distanceText}>
                  {closestStation.distance.toFixed(2)} km away
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${closestStation.latitude},${closestStation.longitude}`
                )}
              >
                <MaterialCommunityIcons name="directions" size={20} color="white" />
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={20} color="white" />
              <Text style={styles.buttonText}>Refresh Location</Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    height: 300,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  stationName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  permissionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    justifyContent: 'center',
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
  },
});

export default ClosestBusStation;*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, FlatList } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2F80ED',
  success: '#27AE60',
  error: '#EB5757',
  background: '#F8F9FA',
  text: '#2D3436',
};

const API_URL = 'https://7ae3-91-186-249-30.ngrok-free.app/busStation/closest-stations'; 

const ClosestBusStation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState(null);

  const fetchNearbyStations = async (latitude, longitude) => {
    try {
      
      const url = new URL(API_URL);
      url.searchParams.append('lat', latitude);
      url.searchParams.append('lon', longitude);
      
      console.log('Fetching from:', url.toString()); // Debug log
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setNearbyStations(data);
console.log('Received stations:', data);
      calculateMapRegion(latitude, longitude);
      setStatus('success');
  
    } catch (error) {
      setErrorMsg(error.message || 'Failed to fetch stations');
      setStatus('error');
    }
  };

  const calculateMapRegion = (userLat, userLon) => {
    setRegion({
      latitude: userLat,
      longitude: userLon,
      latitudeDelta: 0.15, // ~15km radius
      longitudeDelta: 0.15,
    });
  };

  const handleRefresh = async () => {
    setStatus('loading');
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      await fetchNearbyStations(latitude, longitude);
    } catch (error) {
      setErrorMsg('Failed to refresh location. Please try again.');
      setStatus('error');
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      handleRefresh();
    } else {
      setErrorMsg('Location permission is required to find nearby stations.');
      setStatus('error');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        handleRefresh();
      } else {
        setStatus('permission-required');
      }
    })();
  }, []);

  const renderStationItem = ({ item }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <MaterialIcons name="directions-bus" size={20} color={COLORS.primary} />
        <Text style={styles.stationName}>{item.station_name}</Text>
      </View>
      <View style={styles.stationDetails}>
        <Text style={styles.distanceText}>{item.distance.toFixed(2)} km away</Text>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`
          )}
        >
          <MaterialCommunityIcons name="directions" size={16} color="white" />
          <Text style={styles.smallButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Finding nearby stations...</Text>
          </View>
        );

      case 'permission-required':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="location-off" size={60} color={COLORS.text} />
            <Text style={styles.errorText}>Location permission required</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={60} color={COLORS.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success':
        return (
          <>
            <MapView style={styles.map} region={region}>
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Location"
                  pinColor={COLORS.primary}
                />
              )}
              {nearbyStations.map((station, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: station.lat,
                    longitude: station.lon,
                  }}
                  title={station.station_name}
                  description={`${station.distance.toFixed(2)} km away`}
                  pinColor={COLORS.success}
                />
              ))}
            </MapView>

            <FlatList
              data={nearbyStations}
              renderItem={renderStationItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={<Text style={styles.listHeader}>Nearby Stations</Text>}
            />

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={20} color="white" />
              <Text style={styles.buttonText}>Refresh Location</Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    height: 300,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 16,
  },
  stationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.text,
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  permissionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
  },
});

export default ClosestBusStation; */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, FlatList, Animated } from 'react-native';
import { BottomSheet } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2F80ED',
  success: '#27AE60',
  error: '#EB5757',
  background: '#F8F9FA',
  text: '#2D3436',
  skeleton: '#E0E0E0',
};

const API_URL = 'https://7ae3-91-186-249-30.ngrok-free.app/busStation/closest-stations';
const CACHE_KEY = 'stations_cache';
const CACHE_EXPIRY = Infinity; // Never expires

const ClosestBusStation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = ['25%', '60%', '90%'];
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Bottom sheet handlers
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Caching functions
  const getCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;
      
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const cacheData = async (data) => {
    try {
      const cache = {
        timestamp: Date.now(),
        data: data
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const fetchNearbyStations = async (latitude, longitude) => {
    try {
      const cached = await getCachedData();
      if (cached) {
        setNearbyStations(cached);
        setIsCached(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }

      const url = new URL(API_URL);
      url.searchParams.append('lat', latitude);
      url.searchParams.append('lon', longitude);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setNearbyStations(data);
      await cacheData(data);
      setIsCached(false);
      calculateMapRegion(latitude, longitude);
      setStatus('success');

    } catch (error) {
      setErrorMsg(error.message || 'Failed to fetch stations');
      setStatus('error');
    }
  };

  const calculateMapRegion = (userLat, userLon) => {
    setRegion({
      latitude: userLat,
      longitude: userLon,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    });
  };

  const handleRefresh = async () => {
    setStatus('loading');
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      await fetchNearbyStations(latitude, longitude);
    } catch (error) {
      setErrorMsg('Failed to refresh location. Please try again.');
      setStatus('error');
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      handleRefresh();
    } else {
      setErrorMsg('Location permission is required to find nearby stations.');
      setStatus('error');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        handleRefresh();
      } else {
        setStatus('permission-required');
      }
    })();
  }, []);

  // Skeleton Loading Component
  const SkeletonItem = () => (
    <Animated.View style={[styles.stationCard, { opacity: fadeAnim }]}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonCircle, { backgroundColor: COLORS.skeleton }]} />
        <View style={[styles.skeletonText, { backgroundColor: COLORS.skeleton }]} />
      </View>
      <View style={styles.skeletonDetails}>
        <View style={[styles.skeletonLine, { backgroundColor: COLORS.skeleton }]} />
        <View style={[styles.skeletonButton, { backgroundColor: COLORS.skeleton }]} />
      </View>
    </Animated.View>
  );

  const renderStationItem = ({ item }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <MaterialIcons name="directions-bus" size={20} color={COLORS.primary} />
        <Text style={styles.stationName}>{item.station_name}</Text>
      </View>
      <View style={styles.stationDetails}>
        <Text style={styles.distanceText}>{item.distance.toFixed(2)} km away</Text>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`
          )}
        >
          <MaterialCommunityIcons name="directions" size={16} color="white" />
          <Text style={styles.smallButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              {isCached ? 'Updating stations...' : 'Finding nearby stations...'}
            </Text>
          </View>
        );

      case 'permission-required':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="location-off" size={60} color={COLORS.text} />
            <Text style={styles.errorText}>Location permission required</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={60} color={COLORS.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success':
        return (
          <>
            <MapView style={styles.map} region={region}>
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Location"
                  pinColor={COLORS.primary}
                />
              )}
              {nearbyStations.map((station, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: station.lat,
                    longitude: station.lon,
                  }}
                  title={station.station_name}
                  description={`${station.distance.toFixed(2)} km away`}
                  pinColor={COLORS.success}
                />
              ))}
            </MapView>

            <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backgroundStyle={styles.sheetBackground}
              handleIndicatorStyle={styles.sheetHandle}
            >
              <FlatList
                data={nearbyStations}
                renderItem={isCached ? SkeletonItem : renderStationItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                  <Text style={styles.listHeader}>
                    {isCached ? 'Using Cached Data' : 'Nearby Stations'}
                  </Text>
                }
                ListEmptyComponent={
                  <View style={styles.centered}>
                    <Text style={styles.errorText}>No stations found</Text>
                  </View>
                }
              />
            </BottomSheet>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="reload" size={20} color="white" />
              <Text style={styles.buttonText}>Refresh Location</Text>
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetBackground: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sheetHandle: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 4,
    marginVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  stationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.text,
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  permissionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  skeletonText: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    marginLeft: 8,
  },
  skeletonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonLine: {
    height: 14,
    width: '30%',
    borderRadius: 4,
  },
  skeletonButton: {
    width: 80,
    height: 30,
    borderRadius: 6,
  },
});

export default ClosestBusStation;