import diagnosesData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getDiagnoses = (): Diagnosis[] => {
    return diagnosesData;
};

export default { getDiagnoses };