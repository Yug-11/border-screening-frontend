import { useState } from 'react';
import { mockPassengerQueue, mockQueueContext } from '../../../data/mockPassengerQueue';
import { attentionStatuses, queueRisks, queueStatuses } from '../constants/queueOptions';

const initialFilters = { search: '', status: '', risk: '', documentType: '', stage: '' };
const rank = { risk: queueRisks, status: queueStatuses };

export default function usePassengerQueue() {
  const [passengers, setPassengers] = useState(mockPassengerQueue);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState({ key: 'queueNumber', direction: 'asc' });
  const [selection, setSelection] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const filtered = passengers.filter((passenger) => {
    const query = filters.search.trim().toLowerCase();
    return (
      (!query ||
        passenger.name.toLowerCase().includes(query) ||
        ('#' + passenger.queueNumber).includes(query)) &&
      ['status', 'risk', 'documentType', 'stage'].every(
        (key) => !filters[key] || passenger[key] === filters[key],
      )
    );
  });
  const visiblePassengers = [...filtered].sort((first, second) => {
    const difference = rank[sort.key]
      ? rank[sort.key].indexOf(first[sort.key]) - rank[sort.key].indexOf(second[sort.key])
      : first[sort.key] - second[sort.key];
    return (
      (sort.direction === 'asc' ? difference : -difference) ||
      first.queueNumber - second.queueNumber
    );
  });
  const summary = {
    waiting: passengers.filter((passenger) => passenger.status === 'Waiting').length,
    screening: passengers.filter((passenger) => passenger.status === 'In Progress').length,
    review: passengers.filter((passenger) => attentionStatuses.includes(passenger.status)).length,
    clearedToday: mockQueueContext.clearedToday,
  };
  function startScreening(id) {
    const passenger = passengers.find((item) => item.id === id);
    if (!passenger || passenger.status !== 'Waiting') return;
    setPassengers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'In Progress',
              stage: 'Document Detection',
              progress: 5,
              pipeline: item.pipeline.map((step, index) => ({
                ...step,
                status: index === 0 ? 'active' : 'pending',
              })),
            }
          : item,
      ),
    );
    setAnnouncement(
      'Demo screening started for queue #' +
        passenger.queueNumber +
        '. Document Detection, 5%. No analysis is running.',
    );
  }
  return {
    filters,
    sort,
    summary,
    visiblePassengers,
    total: passengers.length,
    announcement,
    selectedPassenger: passengers.find((passenger) => passenger.id === selection?.id) || null,
    drawerMode: selection?.mode,
    updateFilter: (key, value) => setFilters((current) => ({ ...current, [key]: value })),
    clearFilters: () => setFilters(initialFilters),
    changeSort: (key) =>
      setSort((current) => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
      })),
    openPassenger: (passenger, mode) => setSelection({ id: passenger.id, mode }),
    closePassenger: () => setSelection(null),
    startScreening,
  };
}
