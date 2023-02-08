import { v4 as uuidv4 } from 'uuid';
// import patientsData from '../../data/patients.json';
import patientsData from '../../data/patients';
import { Entry, NewPatient, NonSensitivePatientsData, Patient } from '../types';
import { toEntriesEntry } from '../utils';

let { patients } = patientsData;

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientsData[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = { id: uuidv4(), entries: [], ...entry };
  patients.push(newPatient);
  console.log('newPatient :>> ', newPatient);
  return newPatient;
};
const addPatientEntry = (id: string, entry: Entry): Patient | undefined => {
  const ent = toEntriesEntry(entry);

  const patient = patients.find((patient) => id === patient.id);

  if (!ent) {
    throw new Error('invalid entry');
  }

  if (patient) {
    patient.entries.push(ent);
    patients = patients.map((p) => (id === p.id ? patient : p));
  }
  return patient;
};

export default {
  getAll,
  getNonSensitiveEntries,
  addPatient,
  addPatientEntry,
};
