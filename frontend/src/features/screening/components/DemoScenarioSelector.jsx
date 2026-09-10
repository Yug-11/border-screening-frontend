import Select from '../../../components/ui/Select';
import { resultScenarioOptions } from '../../../data/mockScreeningResults';

export default function DemoScenarioSelector({ value, onChange }) {
  return (
    <Select
      label="Demo Scenario"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={resultScenarioOptions}
      helperText="Fictional results only"
    />
  );
}
