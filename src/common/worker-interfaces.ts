export type FindWorkersResponse = {
  id: number;
  documentType: string;
  documentNumber: string;
  apPat: string;
  apMat: string;
  name: string;
  charge: string;
  techSkills: string[];
  isActive: boolean;
  emergencyContacts: EmergencyContact[];
  chiefOfficer: null;
  clientInfo: ClientInfo;
  contractWorkers: ContracWorkers;
};

export type ClientInfo = {
  id: number;
  businessName: string;
  ruc: string;
};

export type ContracWorkers = {
  contractType: string;
};

export type EmergencyContact = {
  id: number;
  name: string;
  phone: string;
  relation: string;
};
