import { useReducer } from 'react';
import { getMockPassengerDetails } from '../../../data/mockPassengerDetails';
import { mockScreeningResults } from '../../../data/mockScreeningResults';

function initialState(scenario) {
  return {
    scenario: Object.hasOwn(mockScreeningResults, scenario) ? scenario : 'high',
    reviewOpen: false,
    acknowledged: false,
    decision: null,
    confirmationOpen: false,
  };
}
function reducer(state, action) {
  switch (action.type) {
    case 'scenario':
      return Object.hasOwn(mockScreeningResults, action.value) && state.scenario !== action.value
        ? initialState(action.value)
        : state;
    case 'review':
      return { ...state, reviewOpen: true };
    case 'close-review':
      return { ...state, reviewOpen: false };
    case 'acknowledge':
      return state.reviewOpen && !state.decision ? { ...state, acknowledged: true } : state;
    case 'request-clearance':
      return !state.decision ? { ...state, confirmationOpen: true } : state;
    case 'cancel-clearance':
      return { ...state, confirmationOpen: false };
    case 'clear':
      return state.confirmationOpen && !state.decision
        ? { ...state, decision: 'cleared', confirmationOpen: false, reviewOpen: false }
        : state;
    case 'refer':
      return state.reviewOpen && !state.decision
        ? { ...state, decision: 'referred', reviewOpen: false }
        : state;
    default:
      return state;
  }
}
export default function usePassengerDetails(passengerId, scenario) {
  const [state, dispatch] = useReducer(reducer, scenario, initialState);
  const details = getMockPassengerDetails(passengerId, state.scenario);
  return {
    ...state,
    details,
    selectScenario: (value) => dispatch({ type: 'scenario', value }),
    openReview: () => dispatch({ type: 'review' }),
    closeReview: () => dispatch({ type: 'close-review' }),
    acknowledge: () => dispatch({ type: 'acknowledge' }),
    requestClearance: () => dispatch({ type: 'request-clearance' }),
    cancelClearance: () => dispatch({ type: 'cancel-clearance' }),
    confirmClearance: () => dispatch({ type: 'clear' }),
    refer: () => dispatch({ type: 'refer' }),
  };
}
