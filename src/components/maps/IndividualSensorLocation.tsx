import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {moderateScale} from '../../utils/responsive';

interface IndividualSensorLocationProps {
  lat: number;
  lon: number;
}

const IndividualSensorLocation: React.FC<IndividualSensorLocationProps> = ({
  lat,
  lon,
}) => {
  const {colors} = useTheme();
  const [showGeoData, setShowGeoData] = useState(false);

  return (
    <MapView
      style={styles.map}
      mapType="mutedStandard"
      loadingEnabled={true}
      loadingBackgroundColor={colors.background}
      loadingIndicatorColor={colors.primary}
      region={{
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      <Marker
        coordinate={{latitude: lat, longitude: lon}}
        onPress={() => setShowGeoData(prev => !prev)}>
        <View style={[styles.marker, {backgroundColor: colors.primary}]} />

        {showGeoData && (
          <View style={styles.calloutWrapper}>
            <View style={styles.calloutContainer}>
              <View style={styles.coordinateItem}>
                <Text style={styles.label}>Lat:</Text>
                <Text style={styles.value}>{lat.toFixed(6)}</Text>
              </View>
              <View style={styles.coordinateItem}>
                <Text style={styles.label}>Lon:</Text>
                <Text style={styles.value}>{lon.toFixed(6)}</Text>
              </View>
            </View>
          </View>
        )}
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '85%',
    height: moderateScale(125),
    borderRadius: 12,
    marginVertical: 20,
    alignSelf: 'center',
  },
  marker: {
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(25) / 2,
  },

  calloutWrapper: {
    position: 'absolute',
    bottom: 35,
    left: '50%',
    transform: [{translateX: -70}], // Half of calloutContainer's width to center it
    alignItems: 'center',
  },

  calloutContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  coordinateItem: {
    marginHorizontal: 2, // Space between Lat and Lon
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 10,
    color: '#555',
  },
});

export default IndividualSensorLocation;
