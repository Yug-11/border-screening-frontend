import { useEffect, useReducer } from 'react';
import { demoScreeningScenarios, mockScreeningProgress } from '../../../data/mockScreeningProgress';
import { screeningSteps } from '../constants/screeningSteps';

const demoStageDuration = 1200;

function createInitialState(scenarioId = 'standard') {
  return {
    scenarioId,
    status: 'ready',
    currentStage: mockScreeningProgress.currentStage,
    stageStates: { ...mockScreeningProgress.stageStates },
    events: [...mockScreeningProgress.events],
    warnings: [],
    failure: null,
  };
}

function appendEvent(events, title, variant = 'info', description) {
  const seconds = mockScreeningProgress.clockStartSeconds + events.length;
  const time = [Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
  return [...events, { id: 'event-' + events.length, time, title, variant, description }];
}

function reducer(state, action) {
  if (action.type === 'reset') return createInitialState(state.scenarioId);
  if (action.type === 'scenario') {
    if (
      state.status === 'running' ||
      !demoScreeningScenarios.some((scenario) => scenario.id === action.id)
    )
      return state;
    return createInitialState(action.id);
  }
  if (action.type === 'run') {
    if (state.status === 'running') return state;
    const initial = createInitialState(state.scenarioId);
    return {
      ...initial,
      status: 'running',
      stageStates: { ...initial.stageStates, [screeningSteps[0].id]: 'active' },
      events: appendEvent(initial.events, screeningSteps[0].label + ' started'),
    };
  }
  if (
    action.type !== 'advance' ||
    state.status !== 'running' ||
    action.stage !== state.currentStage
  )
    return state;
  const index = screeningSteps.findIndex((step) => step.id === state.currentStage);
  const step = screeningSteps[index];
  const scenario = demoScreeningScenarios.find((item) => item.id === state.scenarioId);
  if (scenario.failureStage === step.id) {
    const failure = { stageId: step.id, message: scenario.failureReason };
    return {
      ...state,
      status: 'failed',
      failure,
      stageStates: { ...state.stageStates, [step.id]: 'failed' },
      events: appendEvent(
        state.events,
        step.label + ' failed - demo stopped',
        'danger',
        failure.message,
      ),
    };
  }
  const warning =
    scenario.warningStage === step.id
      ? { stageId: step.id, message: scenario.warningReason }
      : null;
  const stageStates = { ...state.stageStates, [step.id]: warning ? 'warning' : 'completed' };
  const nextStep = screeningSteps[index + 1];
  let events = appendEvent(
    state.events,
    step.label + (warning ? ' warning' : ' completed'),
    warning ? 'warning' : 'success',
    warning?.message,
  );
  if (nextStep) {
    stageStates[nextStep.id] = 'active';
    events = appendEvent(events, nextStep.label + ' started');
  } else
    events = appendEvent(
      events,
      'Automated screening complete - demo',
      warning || state.warnings.length ? 'warning' : 'success',
    );
  return {
    ...state,
    stageStates,
    events,
    currentStage: nextStep?.id || step.id,
    status: nextStep ? 'running' : 'completed',
    warnings: warning ? [...state.warnings, warning] : state.warnings,
  };
}

export default function useScreeningProgress() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  useEffect(() => {
    if (state.status !== 'running') return;
    const timer = setTimeout(
      () => dispatch({ type: 'advance', stage: state.currentStage }),
      demoStageDuration,
    );
    return () => clearTimeout(timer);
  }, [state.status, state.currentStage]);
  const processedCount = screeningSteps.filter((step) =>
    ['completed', 'warning'].includes(state.stageStates[step.id]),
  ).length;
  const steps = screeningSteps.map((step) => ({
    ...step,
    status: state.stageStates[step.id],
    description:
      state.failure?.stageId === step.id
        ? state.failure.message
        : state.warnings.find((warning) => warning.stageId === step.id)?.message,
  }));
  return {
    ...state,
    steps,
    processedCount,
    progress: Math.round((processedCount / screeningSteps.length) * 100),
    currentStep: screeningSteps.find((step) => step.id === state.currentStage),
    scenario: demoScreeningScenarios.find((scenario) => scenario.id === state.scenarioId),
    risk:
      state.stageStates['risk-assessment'] === 'completed'
        ? 'Assessment complete - view result'
        : 'Pending',
    runDemo: () => dispatch({ type: 'run' }),
    resetDemo: () => dispatch({ type: 'reset' }),
    selectScenario: (id) => dispatch({ type: 'scenario', id }),
  };
}
