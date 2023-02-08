import { useStateValue } from '../state';
import { Entry, HealthCheckRating } from '../types';
import { divStyle } from './style';
interface Props {
  entry: Entry;
}

const HealthCheckEntry = ({ entry }: Props) => {
  const [state] = useStateValue();
  const getDiagnosisName = (code: string) => state.diagnoses[code].name;

  return (
    <div style={divStyle}>
      {`${entry.date} ${entry.description}`}
      <ul>
        {entry.diagnosisCodes?.map((diagnosis: string) => (
          <li key={diagnosis}>
            {diagnosis} {getDiagnosisName(diagnosis)}
          </li>
        ))}
      </ul>
      {entry.type === 'HealthCheck'
        ? `${HealthCheckRating[entry.healthCheckRating]}`
        : ''}
      <br />
      diagnose by {entry.specialist}
    </div>
  );
};
export default HealthCheckEntry;
