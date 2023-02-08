import { v4 as uuidv4 } from 'uuid';
import {
  Diagnosis,
  Discharge,
  Entry,
  Gender,
  HealthCheckRating,
  NewPatient,
  SickLeave,
} from './types';

export type Fields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

export type Fields2 = {
  // id: unknown;
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
  type: unknown;
  healthCheckRating?: unknown;
  employerName?: unknown;
  sickLeave?: unknown;
  discharge?: unknown;
};
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
const isNumber = (text: unknown): text is string => {
  return typeof text === 'number' || text instanceof Number;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (text: any): text is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(text);
};

const parseString = (str: unknown) => {
  if (!str || !isString(str)) {
    throw new Error('Incorrect or missing string: ' + str);
  }
  return str;
};
const parseName = (name: unknown) => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};
const parseDOB = (dob: unknown) => {
  if (!dob || !isString(dob)) {
    throw new Error('Incorrect or missing dob: ' + dob);
  }
  return dob;
};
const parseSSN = (ssn: unknown) => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};
const parseGender = (gender: unknown) => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};
const parseOccupation = (occupation: unknown) => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

const toNewPatientEntry = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: Fields): NewPatient => {
  const newEntry: NewPatient = {
    // id: parseId(uuidv4()),
    name: parseName(name),
    dateOfBirth: parseDOB(dateOfBirth),
    ssn: parseSSN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
  };

  return newEntry;
};
const parseId = (id: unknown) => {
  if (!id || !isString(id)) {
    throw new Error('Incorrect or missing id: ' + id);
  }
  return id;
};
const isDiagnosisCodes = (arr: unknown): arr is Array<Diagnosis['code']> => {
  return Array.isArray(arr) && arr.every((ele) => isString(ele));
};
const parseDiagnosisCodes = (diagnosisCodes: unknown) => {
  if (!diagnosisCodes) {
    return;
  }
  if (!isDiagnosisCodes(diagnosisCodes)) {
    throw new Error('Incorrect or missing diagnosis codes: ' + diagnosisCodes);
  }
  return diagnosisCodes;
};

const isType = (
  type: unknown
): type is 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital' => {
  return (
    isString(type) &&
    ['HealthCheck', 'OccupationalHealthcare', 'Hospital'].includes(type)
  );
};
const parseType = (type: unknown) => {
  if (!type || !isType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }
  return type;
};
const isHealthCheckRating = (hc: unknown): hc is HealthCheckRating => {
  return isNumber(hc) && Object.values(HealthCheckRating).includes(hc);
};
const parseHealthCheckRating = (hc: unknown) => {
  if (!hc || !isHealthCheckRating(hc)) {
    throw new Error('Incorrect or missing healthCheckRating: ' + hc);
  }
  return hc;
};

const isSickLeave = (sic: unknown): sic is SickLeave => {
  const sickLeave = sic as SickLeave;
  return (
    sickLeave instanceof Object &&
    sickLeave.startDate !== null &&
    sickLeave.endDate !== null &&
    isString(sickLeave.startDate) &&
    isString(sickLeave.endDate)
  );
};
const parseSickLeave = (sickLeave: unknown) => {
  if (!sickLeave) {
    return;
  }
  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sickLeave: ' + sickLeave);
  }
  if (sickLeave.endDate.length === 0 && sickLeave.startDate.length === 0) {
    return;
  }
  return sickLeave;
};

const isDischarge = (dis: unknown): dis is Discharge => {
  const discharge = dis as Discharge;
  return (
    discharge instanceof Object &&
    discharge.date !== null &&
    discharge.criteria !== null &&
    isString(discharge.date) &&
    isString(discharge.criteria)
  );
};
const parseDischarge = (discharge: unknown) => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge: ' + discharge);
  }
  return discharge;
};
export const toEntriesEntry = ({
  // id,
  description,
  date,
  specialist,
  diagnosisCodes,
  type,
  healthCheckRating,
  employerName,
  sickLeave,
  discharge,
}: Fields2): Entry | undefined => {
  switch (parseType(type)) {
    case 'HealthCheck':
      const healthEntry: Entry = {
        id: parseId(uuidv4()),
        description: parseString(description),
        date: parseString(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(healthCheckRating),
      };

      return healthEntry;
    case 'OccupationalHealthcare':
      const occupationalEntry: Entry = {
        id: parseId(uuidv4()),
        description: parseString(description),
        date: parseString(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        type: 'OccupationalHealthcare',
        employerName: parseString(employerName),
        sickLeave: parseSickLeave(sickLeave),
      };

      return occupationalEntry;
    case 'Hospital':
      const hospitalEntry: Entry = {
        id: parseId(uuidv4()),
        description: parseString(description),
        date: parseString(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        type: 'Hospital',
        discharge: parseDischarge(discharge),
      };

      return hospitalEntry;

    default:
      throw new Error('unknown type');
    // return assertNever(parseType(type));
  }
};

// const assertNever = (value: never): never => {
//   throw new Error(
//     `Unhandled discriminated union member: ${JSON.stringify(value)}`
//   );
// };
export default toNewPatientEntry;
