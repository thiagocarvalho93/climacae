/**
 * Calculates the thermal sensation (Sensação Térmica)
 * This function chooses between Wind Chill and Heat Index based on the temperature range.
 * 
 * @param {number} temperature - temperature in °C
 * @param {number} humidity - relative humidity in %
 * @param {number} windSpeedKmH - wind speed in km/h
 * @returns {number} Perceived temperature in °C
 */
const calculateThermalSensation = (
  temperature: number,
  humidity: number,
  windSpeedKmH: number
): number => {
  // 1. Cold Sensation: Wind Chill (Standard formula for T <= 13°C)
  if (temperature <= 13 && windSpeedKmH > 4.8) {
    return (
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeedKmH, 0.16) +
      0.3965 * temperature * Math.pow(windSpeedKmH, 0.16)
    );
  }

  // 2. Heat Sensation: Heat Index (Standard formula for T >= 26.7°C)
  if (temperature >= 26.7) {
    return calculateHeatIndex(temperature, humidity);
  }

  // 3. Moderate range: Return raw temperature
  return temperature;
};

/**
 * Calculates the Heat Index (Índice de Calor)
 * Based on the Rothfusz regression (National Weather Service)
 */
const calculateHeatIndex = (T: number, RH: number): number => {
  // Simple formula for low heat index
  const simpleHI = 0.5 * (T * 1.8 + 32 + 61.0 + (T * 1.8 + 32 - 68.0) * 1.2 + RH * 0.094);
  
  if (simpleHI < 80) {
    return (simpleHI - 32) / 1.8;
  }

  // Full regression formula (in Fahrenheit)
  const Tf = T * 1.8 + 32;
  let hi =
    -42.379 +
    2.04901523 * Tf +
    10.14333127 * RH -
    0.22475541 * Tf * RH -
    0.00683783 * Tf * Tf -
    0.05481717 * RH * RH +
    0.00122874 * Tf * Tf * RH +
    0.00085282 * Tf * RH * RH -
    0.00000199 * Tf * Tf * RH * RH;

  // Adjustments
  if (RH < 13 && Tf >= 80 && Tf <= 112) {
    const adj = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(Tf - 95)) / 17);
    hi -= adj;
  } else if (RH > 85 && Tf >= 80 && Tf <= 87) {
    const adj = ((RH - 85) / 10) * ((87 - Tf) / 5);
    hi += adj;
  }

  return (hi - 32) / 1.8;
};

export default { calculateThermalSensation };
