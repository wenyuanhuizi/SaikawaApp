import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PMComparisonChart from '../components/dataVisualizations/PMComparisonChart';
import PM25Chart from '../components/dataVisualizations/PM25Chart';
import AQIVisualization from '../components/dataVisualizations/AQIVisualization';
import IndividualSensorLocation from '../components/maps/IndividualSensorLocation';
import {fetchLatestSensorData} from '../services/SensorDataService';
import {SensorData} from '../services/SensorLocationService';

const SensorDataPage = () => {
  const {colors} = useTheme();
  const {sensorData} = useRoute().params as {sensorData: SensorData};
  const navigator = useNavigation();
  const [latestPm25Data, setLatestPm25Data] = useState<{
    value: number;
    date: Date;
  } | null>(null);
  const [aqiValue, setAqiValue] = useState<number | null>(null);

  useEffect(() => {
    const getLatestData = async () => {
      try {
        const data = await fetchLatestSensorData(sensorData, 'raw');
        console.log('Latest data:', data);
        if (data) {
          setLatestPm25Data({
            value: data.y, // PM2.5 value
            date: new Date(data.x), // Timestamp
          });
          const calculatedAqi = calculateAqi(data.y);
          setAqiValue(calculatedAqi);
        }
      } catch (error) {
        console.error('Error fetching latest sensor data:', error);
      }
    };

    getLatestData();
  }, [sensorData]);

  // AQI Breakpoints Mapping
  const aqiBreakpoints = [
    {category: 'Good', min: 0, max: 12.0, aqiMin: 0, aqiMax: 50},
    {category: 'Moderate', min: 12.1, max: 35.4, aqiMin: 51, aqiMax: 100},
    {
      category: 'Unhealthy for Sensitive Groups',
      min: 35.5,
      max: 55.4,
      aqiMin: 101,
      aqiMax: 150,
    },
    {category: 'Unhealthy', min: 55.5, max: 150.4, aqiMin: 151, aqiMax: 200},
    {
      category: 'Very Unhealthy',
      min: 150.5,
      max: 250.4,
      aqiMin: 201,
      aqiMax: 300,
    },
    {category: 'Hazardous', min: 250.5, max: 500.4, aqiMin: 301, aqiMax: 500},
  ];

  /** Calculate AQI Based on PM2.5 Value */
  function calculateAqi(pm25Value: number): number {
    for (const {min, max, aqiMin, aqiMax} of aqiBreakpoints) {
      if (pm25Value >= min && pm25Value <= max) {
        const aqi =
          ((aqiMax - aqiMin) / (max - min)) * (pm25Value - min) + aqiMin;
        return Math.round(aqi);
      }
    }
    return 500; // If value is extremely high, cap at 500
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigator.goBack()}>
          <Icon name="arrow-back" size={30} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.sensorTitle, {color: colors.primary}]}>
          Sensor {sensorData.sensor_id}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <IndividualSensorLocation
          lat={sensorData.sensor_latitude}
          lon={sensorData.sensor_longitude}
        />

        <PMComparisonChart sensorData={sensorData} />
        {/* <PM25Chart sensorData={sensorData} /> */}

        {latestPm25Data !== null && (
          <View style={styles.aqiContainer}>
            <AQIVisualization AQI={aqiValue ?? 0} />
            <Text
              style={[styles.aqiLabel, {color: colors.primary, fontSize: 15}]}>
              Latest Data Available: {latestPm25Data.date.toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  sensorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  aqiContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  aqiLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SensorDataPage;
