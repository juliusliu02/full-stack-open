import express, {NextFunction, Request, Response} from 'express';
import patientService from "../services/patientService";
import { newPatientSchema, toNewEntry } from "../utils";
import { z } from "zod";
import { NewEntry, NewPatient, Patient } from "../types";

const router = express.Router();

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        newPatientSchema.parse(req.body);
        next();
    } catch (err: unknown) {
        next(err);
    }
};

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const patient = patientService.getPatient(id);
    if (!patient) {
        res.status(404).end({});
    } else {
        res.json(patient);
    }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
});

router.post('/:id/entries', (req: Request, res: Response) => {
    try {
        const entry: NewEntry = toNewEntry(req.body);
        res.status(201).send(patientService.addEntry(req.params.id, entry));
    } catch (error) {
        const errorMessage = 'An error occurred';
        if (error instanceof Error) {
            res.status(400).send({ error: errorMessage + ": " + error.message });
            return;
        }
        res.status(400).send({ error: errorMessage });
    }
});

router.use(errorMiddleware);

export default router;