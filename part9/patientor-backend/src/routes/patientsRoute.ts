import express, { Request, Response } from 'express';
import patientsService from '../services/patientsService';
import { Entry } from '../types';
import toNewPatientEntry, { Fields } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getAll());
});
router.get('/nossn', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientsService
    .getAll()
    .find(({ id }) => id === req.params.id);

  if (!patient) {
    return res.status(204).end();
  }

  return res.send(patient);
});

router.post('/:id/entries', (req: Request, res: Response) => {
  const entry = req.body as Entry;
  console.log('entry :>> ', entry);
  const patient = patientsService.addPatientEntry(req.params.id, entry);

  if (!patient) {
    return res.status(204).end();
  }

  return res.send(patient);
});

router.post(
  '/',
  (req: Omit<Request, 'body'> & { body: Fields }, res: Response) => {
    try {
      const newPatientEntry = toNewPatientEntry(req.body);
      const result = patientsService.addPatient(newPatientEntry);
      res.json(result);
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
        res.status(400).send(error.message);
      }
      console.log(errorMessage);
    }
  }
);

export default router;
