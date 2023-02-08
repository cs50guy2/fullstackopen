interface ExerciseParams {
  daily: number[];
  target: number;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: Array<string>): ExerciseParams => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      daily: args.slice(3).map(Number),
      target: Number(args[2]),
    };
  } else {
    throw new Error('Provided arguments are not valid!');
  }
};

const exerciseCalculator = (daily: number[], target: number): Result => {
  const periodLength = daily.length;
  const trainingDays = daily.filter((day) => day > 0).length;
  const totalHours = daily.reduce((a, b) => a + b, 0);
  const avg = totalHours / periodLength;
  const rating = () => {
    if (target - totalHours > 2) {
      return 3;
    }
    if (target - totalHours > 1) {
      return 2;
    } else {
      return 1;
    }
  };
  const description = (rating: number) => {
    switch (rating) {
      case 1:
        return 'bad';
      case 2:
        return 'meh';
      case 3:
        return 'excellent';
      default:
        throw new Error('Unexpected error: rating not valid');
    }
  };
  return {
    periodLength,
    trainingDays,
    success: avg > target ? true : false,
    rating: rating(),
    ratingDescription: description(rating()),
    target,
    average: avg,
  };
};

try {
  const { daily, target } = parseArguments(process.argv);
  console.log(exerciseCalculator(daily, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default exerciseCalculator;
