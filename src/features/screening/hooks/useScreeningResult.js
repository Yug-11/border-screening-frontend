import { useReducer } from 'react';
import { mockScreeningResults } from '../../../data/mockScreeningResults';

function initialState(scenario) {
  return {
    scenario: Object.hasOwn(mockScreeningResults, scenario) ? scenario : 'low',
    clearanceOpen: false,
    cleared: false,
    drawer: null,
    review: 'not-started',
  };
}
function reducer(state, action) {
  if (action.type === 'scenario')
    return Object.hasOwn(mockScreeningResults, action.value) && action.value !== state.scenario
      ? initialState(action.value)
      : state;
  if (action.type === 'request-clearance')
    return state.scenario === 'low' && !state.cleared ? { ...state, clearanceOpen: true } : state;
  if (action.type === 'cancel-clearance') return { ...state, clearanceOpen: false };
  if (action.type === 'confirm-clearance')
    return state.scenario === 'low' && state.clearanceOpen
      ? { ...state, cleared: true, clearanceOpen: false }
      : state;
  if (action.type === 'details') return { ...state, drawer: 'details' };
  if (action.type === 'review')
    return state.scenario !== 'low'
      ? {
          ...state,
          drawer: 'review',
          review: state.review === 'acknowledged' ? 'acknowledged' : 'in-progress',
        }
      : state;
  if (action.type === 'acknowledge-review')
    return state.scenario !== 'low' && state.drawer === 'review'
      ? { ...state, review: 'acknowledged' }
      : state;
  if (action.type === 'close-drawer') return { ...state, drawer: null };
  return state;
}
export default function useScreeningResult(scenario) {
  const [state, dispatch] = useReducer(reducer, scenario, initialState);
  return {
    ...state,
    result: mockScreeningResults[state.scenario],
    selectScenario: (value) => dispatch({ type: 'scenario', value }),
    requestClearance: () => dispatch({ type: 'request-clearance' }),
    cancelClearance: () => dispatch({ type: 'cancel-clearance' }),
    confirmClearance: () => dispatch({ type: 'confirm-clearance' }),
    openDetails: () => dispatch({ type: 'details' }),
    openReview: () => dispatch({ type: 'review' }),
    acknowledgeReview: () => dispatch({ type: 'acknowledge-review' }),
    closeDrawer: () => dispatch({ type: 'close-drawer' }),
  };
}
