import { NewPatient, Gender, Diagnosis, NewEntry, HealthCheckRating } from './types';
import { undefined, z } from 'zod';

export const newPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
});

export const toNewPatient = (object: unknown): NewPatient => {
    return newPatientSchema.parse(object);
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [] as Array<Diagnosis['code']>;
    }

    return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const sickLeaveSchema = z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
});

const dischargeSchema = z.object({
    date: z.string().date(),
    criteria: z.string(),
});

export const toNewEntry = (object: unknown): NewEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Object must be an object');
    }

    if ('type' in object && 'specialist' in object && 'description' in object && 'date' in object) {
        const newEntry = {
            date: z.string().date().parse(object.date),
            description: z.string().parse(object.description),
            specialist: z.string().parse(object.specialist),
            type: z.string().parse(object.type),
            diagnosisCodes: 'diagnosisCodes' in object ? parseDiagnosisCodes(object) : undefined
        };

        if (newEntry.type === 'Hospital') {
            if ('discharge' in object) {
                return {
                    ...newEntry,
                    discharge: dischargeSchema.parse(object.discharge)
                } as NewEntry;
            } else return newEntry as NewEntry;
        }

        if (newEntry.type === 'HealthCheck' && 'healthCheckRating' in object) {
            return {
                ...newEntry,
                healthCheckRating: z.nativeEnum(HealthCheckRating).parse(object.healthCheckRating)
            } as NewEntry;
        }

        if (newEntry.type === 'OccupationalHealthcare' && 'employerName' in object) {
            if ('sickLeave' in object) {
                return {
                    ...newEntry,
                    employerName: z.string().parse(object.employerName),
                    sickLeave: sickLeaveSchema.parse(object.sickLeave)
                } as NewEntry;
            } else return {
                ...newEntry,
                employerName: z.string().parse(object.employerName),
            } as NewEntry;
        }
    }
    throw new Error(`Field missing or invalid`);
};