import express = require('express');

import calculateBmi from './bmiCalculator';
import exerciseCalculator from './exerciseCalculator';
const app = express();

app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});
app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  console.log('height :>> ', height);
  console.log('weight :>> ', weight);
  if (isNaN(height) || isNaN(weight)) {
    return res.send({ Error: 'malformed parmeters' });
  }
  return res.send({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  console.log('target :>> ', target);
  console.log('daily_exercises :>> ', daily_exercises);
  console.log('target :>> ', target);

  if (!target || isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = exerciseCalculator(daily_exercises, target);
  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
