import { useStateValue } from '../state';
import { Entry } from '../types';
import { divStyle } from './style';
interface Props {
  entry: Entry;
}

const HospitalEntry = ({ entry }: Props) => {
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
      <br />
      diagnose by {entry.specialist}
    </div>
  );
};
export default HospitalEntry;
