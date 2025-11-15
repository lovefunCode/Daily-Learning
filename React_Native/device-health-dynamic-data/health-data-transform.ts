/**
 * Data Transformation Module
 * Transforms backend API response formats to frontend component data formats
 *
 * Backend format: { hasData, type, values/menstrual/sport, ... }
 * Frontend format: { type, [dataKey]Data, date, currentValue, unit, ... }
 */

import {
  TYPE_DEEP,
  TYPE_SHALLOW,
  TYPE_AWAKE,
  TYPE_REM,
  sleepStageColorMap,
  cardTypeMapping
} from './health-data-definition';

/**
 * Utility: Format timestamp to MM/DD format
 * @param timestamp - Time in seconds (if > 10B treated as milliseconds)
 * @returns Formatted date string like "11/06"
 */
export const formatDate = (timestamp: number): string => {
  const timestampInSeconds = timestamp > 10000000000 ? timestamp / 1000 : timestamp;
  const date = new Date(timestampInSeconds * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

/**
 * Utility: Format minutes to hours and minutes
 * @param minutes - Total minutes
 * @returns Object with hours and mins as strings
 */
export const formatDuration = (minutes: number): { hours: string; mins: string } => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours: hours.toString(), mins: mins.toString() };
};

/**
 * Transform heart rate data from backend format
 * Backend: { hasData, type: 2, values: [{ time, value(string) }] }
 * Frontend: { type: 'heartRate', heartRateData: [{ value(number) }], date, currentValue, unit }
 */
export const transformHeartRate = (backendData: any): any | null => {
  const values = backendData.values;
  if (!values || values.length === 0) {
    return null;
  }

  const chartData = values.map((item: any) => ({
    value: parseFloat(item.value) || 0,
  }));

  const lastValue = values.length > 0 ? values[values.length - 1] : null;
  const latestTimestamp = lastValue?.time || Date.now() / 1000;
  const formattedDate = formatDate(latestTimestamp);
  const currentValue = values.length > 0 ? parseFloat(values[values.length - 1].value) : 0;

  const result = {
    type: 'heartRate',
    heartRateData: chartData,
    date: formattedDate,
    currentValue: currentValue,
    unit: 'bpm', // beats per minute
  };

  return result;
};

/**
 * Transform respiratory rate data from backend format
 */
export const transformRespiratoryRate = (backendData: any): any | null => {
  const values = backendData.values;
  if (!values || values.length === 0) {
    return null;
  }

  const chartData = values.map((item: any) => ({
    value: parseFloat(item.value) || 0,
  }));

  const lastValue = values.length > 0 ? values[values.length - 1] : null;
  const latestTimestamp = lastValue?.time || Date.now() / 1000;
  const formattedDate = formatDate(latestTimestamp);
  const currentValue = values.length > 0 ? parseFloat(values[values.length - 1].value) : 0;

  const result = {
    type: 'respiratoryRate',
    respiratoryRateData: chartData,
    date: formattedDate,
    currentValue: currentValue,
    unit: 'times', // times per minute
  };

  return result;
};

/**
 * Transform blood oxygen data from backend format
 */
export const transformBloodOxygen = (backendData: any): any | null => {
  const values = backendData.values;
  if (!values || values.length === 0) {
    return null;
  }

  const chartData = values.map((item: any) => ({
    value: parseFloat(item.value) || 0,
  }));

  const lastValue = values.length > 0 ? values[values.length - 1] : null;
  const latestTimestamp = lastValue?.time || Date.now() / 1000;
  const formattedDate = formatDate(latestTimestamp);
  const currentValue = values.length > 0 ? parseFloat(values[values.length - 1].value) : 0;

  const result = {
    type: 'bloodOxygen',
    bloodOxygenData: chartData,
    date: formattedDate,
    currentValue: currentValue,
    unit: '%',
  };

  return result;
};

/**
 * Transform sleep data from backend format
 * Sleep data: values array with each item having { time, type(stage), value(minutes) }
 */
export const transformSleep = (backendData: any): any | null => {
  const values = backendData.values;
  if (!values || values.length === 0) {
    return null;
  }

  // Group sleep stages by type and accumulate minutes
  const stageMap: { [key: string]: number } = {
    [TYPE_DEEP]: 0,
    [TYPE_SHALLOW]: 0,
    [TYPE_AWAKE]: 0,
    [TYPE_REM]: 0,
  };

  values.forEach((item: any) => {
    const stageType = String(item.type);
    const minutes = parseFloat(item.value) || 0;
    if (stageMap.hasOwnProperty(stageType)) {
      stageMap[stageType] += minutes;
    }
  });

  // Build sleepStages array in order: deep → shallow → awake → rem
  const sleepStages: any[] = [];

  if (stageMap[TYPE_DEEP] > 0) {
    sleepStages.push({
      minutes: stageMap[TYPE_DEEP],
      color: sleepStageColorMap[TYPE_DEEP],
    });
  }

  if (stageMap[TYPE_SHALLOW] > 0) {
    sleepStages.push({
      minutes: stageMap[TYPE_SHALLOW],
      color: sleepStageColorMap[TYPE_SHALLOW],
    });
  }

  if (stageMap[TYPE_AWAKE] > 0) {
    sleepStages.push({
      minutes: stageMap[TYPE_AWAKE],
      color: sleepStageColorMap[TYPE_AWAKE],
    });
  }

  if (stageMap[TYPE_REM] > 0) {
    sleepStages.push({
      minutes: stageMap[TYPE_REM],
      color: sleepStageColorMap[TYPE_REM],
    });
  }

  const totalMinutes = sleepStages.reduce((sum, stage) => sum + stage.minutes, 0);
  const lastValue = values.length > 0 ? values[values.length - 1] : null;
  const latestTimestamp = lastValue?.time || Date.now() / 1000;
  const formattedDate = formatDate(latestTimestamp);

  const result = {
    type: 'sleep',
    sleepStages: sleepStages,
    totalMinutes: totalMinutes,
    date: formattedDate,
    unit: 'minutes',
  };

  return result;
};

/**
 * Transform sport record data from backend format
 * Backend: { hasData, type: 0, sport: { type, time, distance(meters), kcal } }
 */
export const transformSportRecord = (backendData: any): any | null => {
  const sport = backendData.sport;
  if (!sport) {
    return null;
  }

  const distanceInMeters = parseFloat(sport.distance) || 0;
  const distanceInKm = distanceInMeters / 1000;

  const result = {
    type: 'sportRecord',
    sportType: sport.type,
    date: formatDate(sport.time),
    currentValue: distanceInKm,
    unit: 'km',
    kcal: sport.kcal,
  };

  return result;
};

/**
 * Transform period tracking data from backend format
 * Backend: { hasData, type: 5, menstrual: { startTime, cycle, severalDay } }
 */
export const transformPeriodTracking = (backendData: any): any | null => {
  console.log('🔍 [PeriodTracking] Backend data received:', backendData);
  const menstrual = backendData.menstrual;
  if (!menstrual) {
    return null;
  }

  const startTimeTimestamp = parseFloat(menstrual.startTime) || 0;
  const lastPeriodDate = new Date(startTimeTimestamp * 1000);
  const cycleLength = menstrual.cycle || 28;
  const periodLength = menstrual.severalDay || 5;

  // Calculate fertile window: ovulation day = cycle - 14, fertile = ovulation ± 5 days
  const ovulationDay = cycleLength - 14;
  const fertileStartDay = ovulationDay - 5;
  const fertileEndDay = ovulationDay + 1;

  const formattedDate = formatDate(startTimeTimestamp);

  const result = {
    type: 'periodTracking',
    lastPeriodDate: lastPeriodDate,
    cycleLength: cycleLength,
    periodLength: periodLength,
    fertileStartDay: fertileStartDay,
    fertileEndDay: fertileEndDay,
    recordDate: formattedDate,
  };

  return result;
};

/**
 * Main transformation function - routes to specific transformers
 * Supports both boolean true and number 1 for hasData flag
 */
export const transformBackendDataToFrontend = (backendData: any): any | null => {
  console.log('🔍 [transformBackendDataToFrontend] Backend data received:', backendData);

  // Validate hasData flag
  if (!backendData || (backendData.hasData !== 1 && backendData.hasData !== true)) {
    return null;
  }

  const backendType = backendData.type;
  const dataTypeKey = cardTypeMapping[backendType];

  if (!dataTypeKey) {
    return null;
  }


  // Route to specific transformer based on data type
  switch (dataTypeKey) {
    case 'heartRate':
      return transformHeartRate(backendData);
    case 'respiratoryRate':
      return transformRespiratoryRate(backendData);
    case 'bloodOxygen':
      return transformBloodOxygen(backendData);
    case 'sleep':
      return transformSleep(backendData);
    case 'sportRecord':
      return transformSportRecord(backendData);
    case 'periodTracking':
      return transformPeriodTracking(backendData);
    default:
      console.log('❌ [BackendData] Unrecognized data type:', dataTypeKey);
      return null;
  }
};
