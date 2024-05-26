import { EnglishLevel } from '../utils/enum-types';

export interface WorkerData {
  documentType: string;
  documentNumer: number;
  apPat: string;
  apMat: string;
  name: string;
  englishLevel: EnglishLevel;
  charge: string;
  birthdate: string;
  hiringDate: Date;
  phoneNumber: string;
  address: string;
  district: string;
  province: string;
  department: string;
  familiarAssignment: string;
  techSkills: string[];
  chiefOfficerId?: number;
}
