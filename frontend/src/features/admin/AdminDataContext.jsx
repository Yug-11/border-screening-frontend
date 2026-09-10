import { useMemo, useState } from 'react';
import {
  initialAdminAlerts,
  initialAdminCheckpoints,
  initialAdminOfficers,
  initialAdminPassengers,
  initialAdminScreenings,
  initialAdminSettings,
} from '../../data/mockAdminData';
import { AdminDataContext } from './AdminDataContext';

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
    // Session persistence is best-effort for the frontend demo.
  }
}

export function AdminDataProvider({ children }) {
  const [checkpoints, setCheckpointsState] = useState(() =>
    readSession('adminDemo.checkpoints', initialAdminCheckpoints),
  );
  const [officers, setOfficersState] = useState(() =>
    readSession('adminDemo.officers', initialAdminOfficers),
  );
  const [alerts, setAlertsState] = useState(() =>
    readSession('adminDemo.alerts', initialAdminAlerts),
  );
  const [settings, setSettingsState] = useState(() =>
    readSession('adminDemo.settings', initialAdminSettings),
  );

  const setCheckpoints = (updater) => {
    setCheckpointsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('adminDemo.checkpoints', next);
      return next;
    });
  };
  const setOfficers = (updater) => {
    setOfficersState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('adminDemo.officers', next);
      return next;
    });
  };
  const setAlerts = (updater) => {
    setAlertsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('adminDemo.alerts', next);
      return next;
    });
  };
  const setSettings = (updater) => {
    setSettingsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      writeSession('adminDemo.settings', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      checkpoints,
      officers,
      passengers: initialAdminPassengers,
      screenings: initialAdminScreenings,
      alerts,
      settings,
      setCheckpoints,
      setOfficers,
      setAlerts,
      setSettings,
      resetSettings: () => setSettings(initialAdminSettings),
    }),
    [alerts, checkpoints, officers, settings],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
