import { Button } from '@material-ui/core';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';
import AddHealthCheckEntryModal from '../AddHealthCheckEntryModal';
import { PatientFormValues as hcPatientFormValues } from '../AddHealthCheckEntryModal/AddPatientForm';
import AddOccupationalHealthcareEntryModal from '../AddOccupationalHealthcareEntryModal';
import { PatientFormValues as occPatientFormValues } from '../AddOccupationalHealthcareEntryModal/AddPatientForm';
import { apiBaseUrl } from '../constants';
import { useStateValue } from '../state';
import { Entry, Patient } from '../types';
import EntryDetails from './EntryDetails';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [state, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<string>('');
  const [error, setError] = useState<string>();

  const openModal = (entryType: string): void => setModalOpen(entryType);

  const closeModal = (): void => {
    setModalOpen('');
    setError(undefined);
  };

  invariant(id);

  const patient = state.patients[id];

  if (!patient || !Object.keys(state.diagnoses).length) {
    return null;
  }

  const submitNewEntry = async (values: hcPatientFormValues) => {
    try {
      const { data: patient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch({ type: 'UPDATE_PATIENT', payload: patient });
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error) || 'Unrecognized axios error'
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
    console.log('values :>> ', values);
  };
  const submitNewEntry2 = async (values: occPatientFormValues) => {
    try {
      const { data: patient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch({ type: 'UPDATE_PATIENT', payload: patient });
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error) || 'Unrecognized axios error'
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
    console.log('values :>> ', values);
  };
  return (
    <div className="App">
      <h2>
        {patient.name}
        {patient.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
      </h2>
      ssn: {patient.ssn}
      <br />
      occupation: {patient.occupation}
      <h3>entries</h3>
      {patient.entries.map((entry: Entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
      <AddHealthCheckEntryModal
        modalOpen={modalOpen === 'HealthCare'}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <AddOccupationalHealthcareEntryModal
        modalOpen={modalOpen === 'OccupationalHealthcare'}
        onSubmit={submitNewEntry2}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal('HealthCare')}>
        Add HealthCare Entry
      </Button>
      <Button
        variant="contained"
        onClick={() => openModal('OccupationalHealthcare')}
      >
        Add OccupationalHealthcare Entry
      </Button>
    </div>
  );
};

export default PatientPage;
