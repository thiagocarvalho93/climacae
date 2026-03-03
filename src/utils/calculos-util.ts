/**
 * Calculates the wind chill
 * @param {number} windSpeed - wind speed in km/h
 * @param {number} temperature - temperature in °C
 * @returns {number} Wind chill in °C
 */
const calculateWindChill = (
  windSpeed: number,
  temperature: number
): number => {
  return (
    33 +
    ((10 * Math.sqrt(windSpeed) + 10.45 - windSpeed) *
      (temperature - 22)) /
      22
  );
};

export default { calculateWindChill };
