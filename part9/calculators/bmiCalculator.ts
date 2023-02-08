interface BMIParams {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): BMIParams => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided arguments are not valid!');
  }
};
const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;

  switch (true) {
    case bmi < 16:
      return 'Underweight (Severe thinness)';

    case 16 <= bmi && bmi <= 16.9:
      return 'Underweight (Moderate thinness)';
    case 17 <= bmi && bmi <= 18.4:
      return 'Underweight (Mild thinness)';
    case 18.5 <= bmi && bmi <= 24.9:
      return 'Normal range';
    case 25 <= bmi:
      return 'Overweight and/or Obese';
    default:
      break;
  }
  return 'malformed parameters';
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;
