import axios from 'axios';
import {BASE_URL} from './Constants';

interface SensorsResponse {
  data: SensorData[];
}

export interface SensorData {
  id: number;
  sensor_id: string;
  sensor_brand: string;
  sensor_latitude: number;
  sensor_longitude: number;
  last_location_update: string;
  is_active: number;
  date_uploaded: string;
}

export const fetchSensorLocations = async (): Promise<SensorData[]> => {
  try {
    const response = await axios.get<SensorsResponse>(`${BASE_URL}/sensors`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch sensor locations: ${response.status}`);
    }

    if (response.data.data.length > 0) {
      return response.data.data.map(sensor => {
        return {
          ...sensor,
          sensor_latitude: parseFloat(sensor.sensor_latitude.toString()),
          sensor_longitude: parseFloat(sensor.sensor_longitude.toString()),
        };
      });
    } else {
      throw new Error('No sensor locations found');
    }
  } catch (error) {
    console.error(`Error fetching sensor locations: ${error}`);
    throw error;
  }
};
