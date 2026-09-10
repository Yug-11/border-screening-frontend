import Select from '../../../components/ui/Select';
import { roleOptions } from '../../../constants/roles';

export default function RoleSelector(props) {
  return (
    <Select {...props} label="Role" options={roleOptions} placeholder="Select your role" required />
  );
}
