import patientData from '../../data/patients';
import { NonSensitivePatient, NewPatient, Patient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): NonSensitivePatient[] => {
    return patientData.map(({id, name, dateOfBirth, gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const getPatient = (pid: string): Patient | undefined => {
    return patientData.find(({ id }) => id === pid);
};

const addPatient = (patient : NewPatient) => {
    const newPatient = {
        id: uuid(),
        entries: [],
        ...patient
    };

    patientData.push(newPatient);
    return newPatient;
};

const addEntry = (pid: string, entry : NewEntry): Entry => {
    const newEntry = {
        ...entry,
        id: uuid(),
    };

    const patient = patientData.find(({ id }) => id === pid);
    if (!patient) {
        throw new Error("patient is not defined");
    }
    patient.entries.push(newEntry);
    return newEntry;
};

export default { getPatient, getPatients, addPatient, addEntry };