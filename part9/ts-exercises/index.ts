import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from "./exerciseCalculator";
import { isNotNumber } from "./utils";
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;
    if (isNotNumber(height) || isNotNumber(weight)) {
        res.status(400).send({error: 'malformatted parameters'});
        return;
    }

    const bmi = calculateBmi(Number(height), Number(weight));
    res.status(200).send({
        weight,
        height,
        bmi
    });
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;
    if (!daily_exercises || !target) {
        res.status(400).send({error: 'parameters missing'});
    }

    // eslint-disable-next-line
    const days: number[] = daily_exercises.map((day: any) => {
        if (isNotNumber(day)) {
            res.status(400).send({error: 'malformatted parameters'});
        }
        return Number(day);
    });

    const t = Number(target);
    const result = calculateExercises(days, t);
    res.status(200).send(result);

});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});