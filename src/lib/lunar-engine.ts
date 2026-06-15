/**
 * Offline Astronomical Engine for Moon Dial
 * Calculates lunar phase and relative positioning without external APIs.
 */

const LUNAR_MONTH_DAYS = 29.530588853;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

export type MoonPhaseType = 
  | 'new' 
  | 'waxing-crescent' 
  | 'first-quarter' 
  | 'waxing-gibbous' 
  | 'full' 
  | 'waning-gibbous' 
  | 'last-quarter' 
  | 'waning-crescent';

export interface MoonData {
  phase: number; // 0 to 1
  phaseName: MoonPhaseType;
  illumination: number; // 0 to 100
  age: number; // days since last new moon
  rotation: number; // degrees for visual orientation
}

export const getMoonData = (date: Date = new Date()): MoonData => {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  const age = daysDiff % LUNAR_MONTH_DAYS;
  const normalizedAge = age < 0 ? age + LUNAR_MONTH_DAYS : age;
  
  const phaseValue = normalizedAge / LUNAR_MONTH_DAYS;
  const illumination = Math.abs(50 - (phaseValue * 100)) * 2; // Rough approximation
  const actualIllumination = 100 - illumination;

  let phaseName: MoonPhaseType = 'new';
  if (phaseValue < 0.03 || phaseValue > 0.97) phaseName = 'new';
  else if (phaseValue < 0.22) phaseName = 'waxing-crescent';
  else if (phaseValue < 0.28) phaseName = 'first-quarter';
  else if (phaseValue < 0.47) phaseName = 'waxing-gibbous';
  else if (phaseValue < 0.53) phaseName = 'full';
  else if (phaseValue < 0.72) phaseName = 'waning-gibbous';
  else if (phaseValue < 0.78) phaseName = 'last-quarter';
  else phaseName = 'waning-crescent';

  return {
    phase: phaseValue,
    phaseName,
    illumination: Math.round(actualIllumination),
    age: Math.round(normalizedAge * 10) / 10,
    rotation: phaseValue * 360
  };
};

/**
 * Calculates the moon's position on a 24-hour clock face relative to the observer's local time.
 * In a simplified model, the moon rises roughly 50 mins later each day.
 */
export const getMoonClockPosition = (date: Date = new Date()): number => {
  const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const data = getMoonData(date);
  
  // Base hourly rotation (15 degrees per hour for Earth's rotation)
  // Adjusted by the moon's lag (roughly 12.2 degrees per day)
  const angle = (hours * 15) - (data.phase * 360);
  return (angle + 360) % 360;
};