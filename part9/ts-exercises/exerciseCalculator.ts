import {isNotNumber} from "./utils";

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

interface Rating {
    rating: number,
    ratingDescription: string
}

interface Data {
    days: number[],
    target: number
}

const parseArguments = (args: string[]): Data => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (isNotNumber(args[2])) {
        throw new Error("not a number: " + args[args.length - 1]);
    }

    const target = Number(args[2]);
    const days: number[] = [];

    for (let i: number = 3; i < args.length; i++) {
        if (isNotNumber(args[i])) {
            throw new Error("not a number: " + args[i]);
        }
        days.push(Number(args[i]));
    }

    return {
        days,
        target
    };
};

const getRating = (avg: number, target: number): Rating => {
    const ratio = avg / target;
    if (ratio >= 1) {
        return {
            rating: 3,
            ratingDescription: "Good job!"
        };
    }
    if (ratio >= 0.8) {
        return {
            rating: 2,
            ratingDescription: "Keep pushing!"
        };
    }
    return {
        rating: 1,
        ratingDescription: "Work harder!"
    };
};

export const calculateExercises = (days: number[], target: number): Result => {
    const avg = (days.reduce((acc, curr) => acc + curr) / days.length);
    const rating = getRating(avg, target);

    return {
        periodLength: days.length,
        trainingDays: days.filter(hour => hour > 0).length,
        success: avg >= target,
        ...rating,
        target: target,
        average: avg
    };
};

if (require.main === module) {
    try {
        const {days, target}: Data = parseArguments(process.argv);
        console.log(calculateExercises(days, target));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}