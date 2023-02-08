import { Entry } from '../types';
import HealthCheckEntry from './HealthCheckEntry';
import HospitalEntry from './HospitalEntry';
import OccupationalHealthcareEntry from './OccupationalHealthcareEntry';

interface Props {
  entry: Entry;
}

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntry entry={entry}/>;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntry entry={entry}/>;
    case 'HealthCheck':
      return <HealthCheckEntry entry={entry}/>;
    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
export default EntryDetails;
