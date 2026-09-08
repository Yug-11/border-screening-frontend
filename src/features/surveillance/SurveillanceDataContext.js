import { createContext, useContext } from 'react';

export const SurveillanceDataContext = createContext(null);

export function useSurveillanceData() {
  const value = useContext(SurveillanceDataContext);
  if (!value) throw new Error('useSurveillanceData must be used within SurveillanceDataProvider');
  return value;
}
