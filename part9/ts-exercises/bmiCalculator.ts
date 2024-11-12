import { isNotNumber } from "./utils";

interface bmiData {
    height: number;
    weight: number;
}

const parseArguments = (args: string[]): bmiData => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

export const calculateBmi = (height: number, weight: number): string => {
    const bmi = weight / ((height/100) ** 2);
    switch (true) {
        case (bmi < 0): {
            return "error";
        }
        case (bmi < 18.5): {
            return "underweight";
        }
        case (bmi < 25): {
            return "normal range";
        }
        default:
            return "overweight";
    }
};

if (require.main === module) {
    try {
        const { height, weight }: bmiData = parseArguments(process.argv);
        console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}