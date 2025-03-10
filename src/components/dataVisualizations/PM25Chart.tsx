import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {BarChart} from 'react-native-gifted-charts';
import DateSelection from '../common/DateSelection';
import {fetchSensorData} from '../../services/SensorDataService';
import {SensorData} from '../../services/SensorLocationService';

interface PM25ChartProps {
  sensorData: SensorData;
  style?: object;
}

const PM25Chart: React.FC<PM25ChartProps> = ({sensorData, style}) => {
  const {colors} = useTheme();
  const [error, setError] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [barData, setBarData] = useState<any[]>([]);

  const handleNewStartDate = (newStart: Date) => {
    const maxDays = 3;
    let maxEndDate = new Date(newStart);
    maxEndDate.setDate(newStart.getDate() + maxDays);

    if (endDate > maxEndDate) {
      setStartDate(newStart);
      setEndDate(maxEndDate);
    } else {
      setStartDate(newStart);
    }
  };

  const handleNewEndDate = (newEnd: Date) => {
    const minDays = 3;
    let minStartDate = new Date(newEnd);
    minStartDate.setDate(newEnd.getDate() - minDays);

    if (startDate < minStartDate || newEnd < startDate) {
      setStartDate(minStartDate);
      setEndDate(newEnd);
    } else {
      setEndDate(newEnd);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStart = new Date(startDate);
        const formattedEnd = new Date(endDate);

        const data = await fetchSensorData(
          sensorData,
          'raw',
          formattedStart,
          formattedEnd,
        );

        if (!data || data.length === 0) {
          setError('No data available for the selected date range');
          return;
        }

        setError('');
        const formattedData = data.map(d => ({
          value: d.y,
          label: new Date(d.x).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          frontColor: colors.primary,
        }));
        setBarData(formattedData);
      } catch (err: any) {
        setError('Try a different date range');
      }
    };
    fetchData();
  }, [sensorData, startDate, endDate, colors.primary]);

  const pointerConfig = {
    pointerStripHeight: 160,
    pointerStripColor: '#D3D3D3',
    pointerStripWidth: 2,
    pointerColor: '#D3D3D3',
    radius: 4,
    pointerLabelWidth: 100,
    pointerLabelHeight: 90,
    pointerLabelComponent: (items: any) => {
      return (
        <View style={styles.tooltip}>
          <Text>{`Time: ${items[0].label}`}</Text>
          <Text>{`PM2.5: ${items[0].value} µg/m³`}</Text>
        </View>
      );
    },
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dateSelectionContainer}>
        <DateSelection
          title="Select start date"
          selectedDate={startDate}
          setSelectedDate={handleNewStartDate}
          style={styles.dateSelection}
        />
        <DateSelection
          title="Select end date"
          selectedDate={endDate}
          setSelectedDate={handleNewEndDate}
          style={styles.dateSelection}
        />
      </View>
      <BarChart
        data={barData}
        barWidth={22}
        barBorderRadius={4}
        yAxisLabelSuffix=" µg/m³"
        xAxisLabelTextStyle={{rotation: 45, fontSize: 12, color: colors.text}}
        yAxisTextStyle={{fontSize: 12, color: colors.text}}
        pointerConfig={pointerConfig}
        yAxisColor={colors.text}
        xAxisColor={colors.text}
        // hideXAxisText={false}
        hideYAxisText={false}
        yAxisThickness={1}
        xAxisThickness={1}
        yAxisLabelWidth={40}
        noOfSections={10}
        maxValue={Math.max(...barData.map(d => d.value)) + 10}
        stepValue={10}
        backgroundColor={colors.background}
      />
      {error !== '' && (
        <Text style={[styles.error, {color: colors.notification}]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  dateSelectionContainer: {
    width: '82%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  dateSelection: {
    width: '80%',
  },
  tooltip: {
    width: 100,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PM25Chart;
