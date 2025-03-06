import React, { useEffect, useState } from 'react';
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

export default ClosestBusStation;