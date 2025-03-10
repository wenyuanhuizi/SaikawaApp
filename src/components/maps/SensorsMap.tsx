import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';
import {RootStackParamList} from '../../NavigationManager';
import {SensorData} from '../../services/SensorLocationService';

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

interface SensorLocationProps {
  region: Region;
  sensorLocations: SensorData[];
}

const SensorsMap: React.FC<SensorLocationProps> = ({
  region,
  sensorLocations,
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationType>();

  return (
    <MapView
      style={styles.map}
      mapType="mutedStandard"
      showsScale={true}
      loadingEnabled={true}
      loadingBackgroundColor={colors.background}
      loadingIndicatorColor={colors.primary}
      // tintColor=''
      region={region}>
      {sensorLocations.map((sensor, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: sensor.sensor_latitude,
            longitude: sensor.sensor_longitude,
          }}
          onPress={() => {
            navigation.navigate('Sensor', {
              sensorData: sensor,
            });
          }}>
          <View
            style={[
              styles.marker,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
});

export default SensorsMap;
