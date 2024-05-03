export interface SearchCriteria {
  documentType?: string;
  documentNumber?: number;
  apPat?: string;
  apMat?: string;
  name?: string;
  charge?: string;
  contractType?: string;
  techSkills?: string[]; // Si techSkills es un array
}
