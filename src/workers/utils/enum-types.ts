export enum DocumentType {
  DNI = 'Dni',
  CE = 'Carnet Extranjeria',
  PASS = 'Pasaporte',
}

export enum EnglishLevel {
  BASIC = 'Basico',
  INTERM = 'Intermedio',
  AVANZ = 'Avanzado',
  NAT = 'Nativo',
}

// export enum ContractType {
//   //[CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]
//   WORK_CONTRACT = 'CONTRATO POR OBRAS',
//   PAYROLL_CONTRACT = 'CONTRATO POR PLANILLA',
//   RXH_CONTRACT = 'RECIBOS POR HONORARIOS',
// }

export enum BankNames {
  INTERBANK = 'INTERBANK',
  BCP = 'BANCO DE CREDITO',
  BBVA = 'BANCO CONTINENTAL',
  SCOTIABANK = 'SCOTIABANK',
  MIBANCO = 'MI BANCO',
  BANBIF = 'BANBIF',
  BANCO_LA_NACION = 'BANCO DE LA NACION',
}

export enum BankAccountTypes {
  CTS = 'CTA CTS',
  SUELDO = 'CTA SUELDO',
  AHORROS = 'CTA AHORROS',
}

export enum Seniority {
  JUNIOR = 'Junior',
  SEMI_SENIOR = 'Semi Senior',
  SENIOR = 'Senior',
}

export enum WorkerStatus {
  LABORANDO = 'Laborando',
  PENDIENTE = 'Pendiente',
  NO_LABORANDO = 'No Laborando',
}
