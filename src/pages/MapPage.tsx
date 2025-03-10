import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  SensorData,
  fetchSensorLocations,
} from '../services/SensorLocationService';
import SensorsMap from '../components/maps/SensorsMap';
import Dropdown from '../components/common/Dropdown';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MapPage = () => {
  // Fetch sensor locations from the database
  const [sensorLocations, setSensorLocations] = useState<SensorData[]>([]);
  useEffect(() => {
    fetchSensorLocations()
      .then(locations => {
        setSensorLocations(locations);
      })
      .catch(error => {
        console.error(`Error fetching sensor locations: ${error}`);
      });
  }, []);

  // initial regions for the map
  const atlantaRegion = {
    latitude: 33.755,
    longitude: -84.365,
    latitudeDelta: 0.375,
    longitudeDelta: 0.035,
  };
  const guatemalaRegion = {
    latitude: 15.26717,
    longitude: -90.49532,
    latitudeDelta: 4,
    longitudeDelta: 0.1,
  };
  const [region, setRegion] = useState(guatemalaRegion);

  const handleRegionChange = (region_name: string) => {
    if (region_name === 'Atlanta, GA') {
      setRegion(atlantaRegion);
    } else {
      setRegion(guatemalaRegion);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* location selector dropdown menu */}
      <Dropdown
        dropdownOptions={['Atlanta, GA', 'Guatemala']}
        onOptionSelection={handleRegionChange}
        initSelected="Guatemala"
        style={[styles.dropdownContainer, {top: insets.top + 10}]}
      />

      <SensorsMap region={region} sensorLocations={sensorLocations} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  dropdownContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: -75}],
    zIndex: 999,
  },
});

export default MapPage;
