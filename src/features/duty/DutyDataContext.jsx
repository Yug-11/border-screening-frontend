import { useMemo, useState } from 'react';
import { dutyAlerts, dutyPassengerHistory, dutyReportTrend } from '../../data/mockDutyOperationalData';
import { DutyDataContext } from './DutyDataContext';

function readSession(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session persistence is best-effort for frontend demo state.
  }
}

export function DutyDataProvider({ children }) {
  const [alerts, setAlertsState] = useState(() =>
    readSession('dutyDemo.alerts', dutyAlerts),
  );

  const setAlerts = (updater) => {
    setAlertsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('dutyDemo.alerts', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      passengerHistory: dutyPassengerHistory,
      reportTrend: dutyReportTrend,
      alerts,
      setAlerts,
    }),
    [alerts],
  );

  return <DutyDataContext.Provider value={value}>{children}</DutyDataContext.Provider>;
}
