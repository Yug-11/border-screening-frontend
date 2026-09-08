import { useMemo, useState } from 'react';
import {
  surveillanceAlerts,
  surveillanceCheckpoints,
  surveillanceHealth,
  surveillanceHistory,
  surveillanceOfficers,
  surveillancePassengers,
  surveillanceReportTrend,
  surveillanceScreenings,
} from '../../data/mockSurveillanceData';
import { SurveillanceDataContext } from './SurveillanceDataContext';

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
    // Session persistence is best-effort for this frontend-only demo.
  }
}

export function SurveillanceDataProvider({ children }) {
  const [checkpoints, setCheckpointsState] = useState(() =>
    readSession('surveillanceDemo.checkpoints', surveillanceCheckpoints),
  );
  const [alerts, setAlertsState] = useState(() =>
    readSession('surveillanceDemo.alerts', surveillanceAlerts),
  );
  const [officers, setOfficersState] = useState(() =>
    readSession('surveillanceDemo.officers', surveillanceOfficers),
  );

  const setCheckpoints = (updater) => {
    setCheckpointsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('surveillanceDemo.checkpoints', next);
      return next;
    });
  };
  const setAlerts = (updater) => {
    setAlertsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('surveillanceDemo.alerts', next);
      return next;
    });
  };
  const setOfficers = (updater) => {
    setOfficersState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('surveillanceDemo.officers', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      checkpoints,
      passengers: surveillancePassengers,
      screenings: surveillanceScreenings,
      alerts,
      officers,
      health: surveillanceHealth,
      history: surveillanceHistory,
      reportTrend: surveillanceReportTrend,
      setCheckpoints,
      setAlerts,
      setOfficers,
    }),
    [alerts, checkpoints, officers],
  );

  return <SurveillanceDataContext.Provider value={value}>{children}</SurveillanceDataContext.Provider>;
}
