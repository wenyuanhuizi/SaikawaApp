import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {VictoryAxis, VictoryChart, VictoryLine} from 'victory-native';
import PrimaryButton from '../common/PrimaryButton';
import DateSelection from '../common/DateSelection';
import {fetchSensorData} from '../../services/SensorDataService';
import {getMockHourlySensorData} from '../../data/mockSensorData';
import {SensorData} from '../../services/SensorLocationService';

interface PMComparisonChartProps {
  sensorData: SensorData;
  style?: object;
}

const PMComparisonChart: React.FC<PMComparisonChartProps> = ({
  sensorData,
  style,
}) => {
  const {colors} = useTheme();
  const [error, setError] = useState<string>('');
  // const [model, setModel] = React.useState<'raw' | 'hourly' | 'daily'>('raw');
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  const tempData = getMockHourlySensorData().map(d => ({
    x: new Date(d.dayhour),
    y: d.corrected_PM25h,
  }));
  // Leave commented until we setup the corrected data storage pipeline
  // const [corrected_data, setCorrectedData] = React.useState<
  //   {x: Date; y: number}[]
  // >([]);
  const [raw_data, setRawData] = useState<{x: Date; y: number}[]>([]);
  const [tickValues, setTickValues] = useState<Date[]>(tempData.map(d => d.x));

  const handleNewStartDate = (newStart: Date) => {
    // const maxDays = model === 'hourly' ? 3 : 30;
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
    // const minDays = model === 'hourly' ? 3 : 30;
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
        const data = await fetchSensorData(
          sensorData,
          'raw', // hardcoded until we handle corrected data
          startDate,
          endDate,
        );
        if (data.length === 0) {
          setError('No data available for the selected date range');
          setRawData([]);
          return;
        }
        setError('');
        setRawData(data);
        setTickValues(data.map(d => d.x));
        setError('');
      } catch (err: any) {
        // console.error('PMComparisonChart.tsx::useEffect()::fetchData()', err);
        setError(err.message || 'An unexpected error occurred.');
        setRawData([]);
      }
    };

    fetchData();
  }, [sensorData, startDate, endDate, error]);

  return (
    <View style={[styles.container, style]}>
      {/* Leave commented until we setup the corrected data storage pipeline */}
      {/* <View style={styles.modelSelectors}>
        <PrimaryButton
          title="Hourly"
          onPress={() => setModel('hourly')}
          color={model === 'hourly' ? colors.background : colors.primary}
          style={[
            styles.modelSelector,
            model === 'hourly' && {backgroundColor: colors.primary},
          ]}
        />
        <PrimaryButton
          title="Daily"
          onPress={() => setModel('daily')}
          color={model === 'daily' ? colors.background : colors.primary}
          style={[
            styles.modelSelector,
            model === 'daily' && {backgroundColor: colors.primary},
          ]}
        />
      </View> */}
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
      <VictoryChart
        height={180}
        padding={{top: 20, bottom: 40, left: 50, right: 50}}>
        {/* Leave commented until we setup the corrected data storage pipeline */}
        {/* <VictoryLine
          data={corrected_data}
          interpolation={'natural'}
          animate={{
            duration: 2000,
            onLoad: {duration: 1000},
          }}
          style={{
            data: {
              stroke: colors.primary,
              strokeWidth: 3,
              strokeLinecap: 'round',
            },
          }}
        /> */}
        <VictoryLine
          data={raw_data}
          interpolation={'natural'}
          animate={{
            duration: 2000,
            onLoad: {duration: 1000},
          }}
          style={{
            data: {
              stroke: colors.notification,
              strokeWidth: 3,
              strokeLinecap: 'round',
            },
          }}
        />
        <VictoryAxis
          tickValues={tickValues}
          tickFormat={t =>
            `${t.getMonth()}-${t.getDate() + 1}-${t.getFullYear()}`
          }
          fixLabelOverlap={true}
          style={{
            axis: {stroke: colors.text},
            ticks: {stroke: colors.text, size: 5},
            tickLabels: {fill: colors.text},
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: {stroke: colors.text},
            ticks: {stroke: colors.text, size: 5},
            tickLabels: {fill: colors.text},
          }}
        />
      </VictoryChart>
      {error === '' ? (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, {backgroundColor: colors.notification}]}
            />
            <Text style={{color: colors.notification}}>Raw Data</Text>
          </View>
          {/* <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, {backgroundColor: colors.primary}]}
            />
            <Text style={{color: colors.primary}}>Corrected Data</Text>
          </View> */}
        </View>
      ) : (
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
  modelSelectors: {
    flexDirection: 'row',
    gap: 10,
  },
  modelSelector: {
    width: '40%',
    height: 40,
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PMComparisonChart;
