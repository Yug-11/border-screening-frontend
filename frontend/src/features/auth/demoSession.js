const DEMO_SESSION_KEY = 'borderScreening.demoSession';

export function setDemoSession(role) {
  sessionStorage.setItem(
    DEMO_SESSION_KEY,
    JSON.stringify({ role, signedInAt: new Date().toISOString() }),
  );
}

export function getDemoSession() {
  try {
    const value = sessionStorage.getItem(DEMO_SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export function hasDemoRole(role) {
  return getDemoSession()?.role === role;
}
