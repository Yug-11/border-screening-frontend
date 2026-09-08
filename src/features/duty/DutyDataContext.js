import { createContext, useContext } from 'react';

export const DutyDataContext = createContext(null);

export function useDutyData() {
  const value = useContext(DutyDataContext);
  if (!value) throw new Error('useDutyData must be used within DutyDataProvider');
  return value;
}
