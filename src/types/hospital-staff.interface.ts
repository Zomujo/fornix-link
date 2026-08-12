import { IDoctor } from '@/types/doctor.interface';

export type HospitalStaffRole = 'owner' | 'admin' | 'doctor';
export type HospitalStaffStatus = 'invited' | 'active' | 'suspended' | 'removed';
export type InviteHospitalStaffRole = 'admin' | 'doctor';

export interface IHospitalStaffMember {
  id: string;
  hospitalId: string;
  userId: string;
  doctorId: string | null;
  role: HospitalStaffRole | string;
  status: HospitalStaffStatus | string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status?: string;
  };
  doctor?: Pick<
    IDoctor,
    'id' | 'firstName' | 'lastName' | 'email' | 'profilePicture' | 'contact'
  > | null;
}

export interface IInviteHospitalStaff {
  email: string;
  firstName: string;
  lastName: string;
  role: InviteHospitalStaffRole;
}

export interface IHospitalStaffInvitePreview {
  hospitalId: string;
  hospitalName: string;
  hospitalLogo?: string | null;
  role: InviteHospitalStaffRole | string;
  email: string;
  expiresAt: string;
}

export interface IHospitalStaffQuery {
  role?: HospitalStaffRole | '';
  status?: HospitalStaffStatus | '';
}
