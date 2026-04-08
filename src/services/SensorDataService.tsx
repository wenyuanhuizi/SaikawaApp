import axios from 'axios';
import {BASE_URL} from './Constants';
import {SensorData} from './SensorLocationService';


export interface CorrectedDailySensorData {
  date: string;
  corrected_value: number;
}

export interface CorrectedHourlySensorData {
  dayhour: string;
  corrected_value: number;
}

export const fetchSensorData = async (
  sensorData: SensorData,
  timeFormat: 'raw' | 'daily' | 'hourly',
  startDate: Date,
  endDate: Date,
  maxDataPoints: number = 100,
): Promise<{x: Date; y: number}[]> => {
  try {
    // TODO: we havn't used the corrected data yet 
    const measurement_type = timeFormat === 'raw' ? 'RAW' : 'CORRECTED';
    const measurement_model =
      timeFormat === 'raw' ? 'RAW_MODEL' : 'CORRECTED_MODEL'; // confirm if CORRECTED_MODEL is the right value here
    const measurement_time_interval =
      timeFormat === 'raw' ? 'OTHER' : timeFormat.toUpperCase();

        
    const url = `${BASE_URL}/readings/json/${sensorData.sensor_brand}/${sensorData.sensor_id}/${measurement_model}/${measurement_type}/${measurement_time_interval}?start_date=${formatDateForQuery(startDate)}&end_date=${formatDateForQuery(endDate)}`;
    console.log(`Fetching corrected sensor data from ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let json = response.ok ? await response.json() : null;
    if (!json || json.length === 0) {
      throw new Error('No data available for the selected date range. Please try a different range.');
    }

    console.log('Data length:', json.length);
    json = json.map((d: any) => {
      return {
        x: new Date(
          timeFormat === 'raw'
            ? d.time
            : timeFormat === 'daily'
              ? d.day
              : d.dayhour,
        ),
        y:
          timeFormat === 'raw'
            ? d.pm25
            : timeFormat === 'daily'
              ? d.corrected_PM25d
              : d.corrected_PM25h,
      };
    });

    const filtered = removeDuplicates(json).sort(
      (a, b) => a.x.getTime() - b.x.getTime(),
    );

    console.log('Filtered data:', filtered.length);

    // Aggregate the data points if necessary.
    const aggregated =
      filtered.length > maxDataPoints
        ? aggregateDataPoints(filtered, maxDataPoints)
        : filtered;

    console.log('Aggregated data:', aggregated.length);

    return aggregated;
  } catch (error) {
    // console.error('Error in fetchSensorData:', error);
    throw error;
  }
};

const aggregateDataPoints = (
  data: { x: Date; y: number }[],
  maxPoints: number,
): { x: Date; y: number }[] => {
  const aggregated: { x: Date; y: number }[] = [];
  const groupSize = Math.floor(data.length / maxPoints);

  // If the group size is less than 1, return original data
  if (groupSize < 1) return data;

  for (let i = 0; i < maxPoints; i++) {
    const start = i * groupSize;
    // For the last group, include all remaining points.
    const end = i === maxPoints - 1 ? data.length : (i + 1) * groupSize;
    const group = data.slice(start, end);

    // Calculate the average timestamp (as the average of the epoch times)
    const avgTime =
      new Date(
        group.reduce((sum, point) => sum + point.x.getTime(), 0) / group.length,
      );

    // Calculate the average y value.
    const avgY =
      group.reduce((sum, point) => sum + point.y, 0) / group.length;

    aggregated.push({ x: avgTime, y: avgY });
  }

  return aggregated;
};


const removeDuplicates = (data: {x: Date; y: number}[]) => {
  const seen = new Set<string>();
  return data.filter(d => {
    const iso = d.x.toISOString();
    if (seen.has(iso)) return false;
    seen.add(iso);
    return true;
  });
};

const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const fetchLatestSensorData = async (
  sensorData: SensorData,
  timeFormat: 'raw' | 'daily' | 'hourly',
): Promise<{x: Date; y: number} | null> => {
  try {
    const measurement_type = timeFormat === 'raw' ? 'RAW' : 'CORRECTED';
    const measurement_model =
      timeFormat === 'raw' ? 'RAW_MODEL' : 'CORRECTED_MODEL';
    const measurement_time_interval =
      timeFormat === 'raw' ? 'OTHER' : timeFormat.toUpperCase();

    const url = `${BASE_URL}/readings/last/${sensorData.sensor_brand}/${sensorData.sensor_id}/${measurement_model}/${measurement_type}/${measurement_time_interval}`;

    console.log(`Fetching latest sensor data from ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the latest sensor data (${response.status}).`,
      );
    }

    const json = await response.json();
    if (!json || json.length === 0) {
      throw new Error('No latest sensor data available.');
    }

    const latestData = json[0]; // Ensure we only take the latest entry
    if (!latestData) {
      throw new Error('No valid data found in response.');
    }

    console.log('Latest data:', latestData);

    return {
      x: new Date(latestData.time),
      y:
        timeFormat === 'raw'
          ? latestData.pm25
          : timeFormat === 'daily'
            ? latestData.corrected_PM25d
            : latestData.corrected_PM25h,
    };
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    return null; // Return null instead of throwing to avoid app crashes
  }
};
