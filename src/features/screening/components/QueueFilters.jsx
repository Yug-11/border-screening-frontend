import Button from '../../../components/ui/Button';
import FilterBar from '../../../components/ui/FilterBar';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { documentTypes } from '../../../constants/documentTypes';
import { queueRisks, queueStages, queueStatuses } from '../constants/queueOptions';

const fields = [
  { key: 'status', label: 'Status', values: queueStatuses },
  { key: 'risk', label: 'Risk', values: queueRisks },
  { key: 'documentType', label: 'Document type', values: documentTypes },
  { key: 'stage', label: 'Screening stage', values: queueStages },
];

export default function QueueFilters({ filters, onChange, onClear }) {
  return (
    <FilterBar
      label="Queue filters"
      actions={
        <Button variant="ghost" size="small" onClick={onClear}>
          Clear Filters
        </Button>
      }
    >
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SearchInput
          label="Search passenger"
          placeholder="Passenger or queue number"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
        {fields.map(({ key, label, values }) => (
          <Select
            key={key}
            label={label}
            value={filters[key]}
            onChange={(event) => onChange(key, event.target.value)}
            options={[
              { value: '', label: 'All' },
              ...values.map((value) => ({ value, label: value })),
            ]}
          />
        ))}
      </div>
    </FilterBar>
  );
}
