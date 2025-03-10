/*
 * AQI information as defined by the EPA
 * https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf
 */
interface AQIRange {
  min: number;
  max: number;
  color: string;
  label: string;
  description: string;
}

export const getAQIRanges = () => {
  const ranges: AQIRange[] = [
    {
      min: 0,
      max: 50,
      color: '#00e400',
      label: 'Good',
      description:
        'Air quality is satisfactory, and air pollution poses little or no risk.',
    },
    {
      min: 51,
      max: 100,
      color: '#ffff00',
      label: 'Moderate',
      description:
        'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
    },
    {
      min: 101,
      max: 150,
      color: '#ff7e00',
      label: 'Unhealthy for Sensitive Groups',
      description:
        'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    },
    {
      min: 151,
      max: 200,
      color: '#ff0000',
      label: 'Unhealthy',
      description:
        'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
    },
    {
      min: 201,
      max: 300,
      color: '#8f3f97',
      label: 'Very Unhealthy',
      description:
        'Health alert: The risk of health effects is increased for everyone.',
    },
    {
      min: 301,
      max: 500,
      color: '#7e0023',
      label: 'Hazardous',
      description:
        'Health warning of emergency conditions: everyone is more likely to be affected.',
    },
  ];
  return ranges;
};

interface AQIAbove100 {
  ozone: string[];
  pm25: string[];
  pm10: string[];
  co: string[];
  no2: string[];
  so2: string[];
}

const AQIAbove100GroupsAtRisk: AQIAbove100 = {
  ozone: [
    'people with lung disease',
    'children',
    'older adults',
    'people who are active outdoors (including outdoor workers)',
    'people with certain genetic variants',
    'people with diets limited in certain nutrients',
  ],
  pm25: [
    'people with heart or lung disease',
    'older adults',
    'children',
    'people of lower socioeconomic status',
  ],
  pm10: [
    'people with heart or lung disease',
    'older adults',
    'children',
    'people of lower socioeconomic status',
  ],
  co: ['people with heart disease'],
  no2: ['people with asthma', 'children', 'older adults'],
  so2: ['people with asthma', 'children', 'older adults'],
};

export const getAQIWarnings = (
  ozoneAQI: number,
  pm25AQI: number,
  pm10AQI: number,
  coAQI: number,
  no2AQI: number,
  so2AQI: number,
) => {
  const warnings: string[] = [];
  if (ozoneAQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.ozone);
  }
  if (pm25AQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.pm25);
  }
  if (pm10AQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.pm10);
  }
  if (coAQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.co);
  }
  if (no2AQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.no2);
  }
  if (so2AQI > 100) {
    warnings.push(...AQIAbove100GroupsAtRisk.so2);
  }
  return warnings;
};
