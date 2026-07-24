export interface BaseCountResponse {
  all: number;
  allInc: number;
}

export interface IStatsCard {
  title: string | number;
  value: string | number;
  percentage?: string | number;
  trend?: 'up' | 'down';
}

export interface IDoctorCountResponse extends BaseCountResponse {
  pending: number;
  active: number;
  activeInc: number;
  pendingInc: number;
}

export interface IOrganizationRequestsCountResponse extends BaseCountResponse {
  approved: number;
  approvedInc: number;
  rejected: number;
  rejectedInc: number;
}

export interface IPatientCountResponse extends IDoctorCountResponse {
  deactivated: number;
  deactivatedInc: number;
}

export interface IHospitalCountResponse extends BaseCountResponse {
  active: number;
  activeInc: number;
  deactivated: number;
  deactivatedInc: number;
  verified: number;
  verifiedInc: number;
}
