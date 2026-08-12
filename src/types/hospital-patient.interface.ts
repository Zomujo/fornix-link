import { IDoctor } from '@/types/doctor.interface';
import { IPatient } from '@/types/patient.interface';

export interface IHospitalPatient {
  id: string;
  hospitalId: string;
  patientId: string;
  assignedDoctorId?: string | null;
  patient?: IPatient;
  assignedDoctor?: Pick<
    IDoctor,
    'id' | 'firstName' | 'lastName' | 'email' | 'profilePicture' | 'contact'
  > | null;
  unassigned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalStaffDoctor {
  id: string;
  hospitalId: string;
  userId: string;
  doctorId: string | null;
  role: string;
  status: string;
  doctor?: Pick<
    IDoctor,
    'id' | 'firstName' | 'lastName' | 'email' | 'profilePicture' | 'contact'
  > | null;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status?: string;
  };
}

export interface ICareAccessGrant {
  id: string;
  patientId: string;
  doctorId?: string | null;
  hospitalId?: string | null;
  status: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  doctor?: Pick<IDoctor, 'id' | 'firstName' | 'lastName' | 'email' | 'profilePicture'> | null;
  hospital?: { id: string; name: string } | null;
}

export interface ICareAccessHospitalPatient {
  id: string;
  hospitalId: string;
  patientId: string;
  assignedDoctorId?: string | null;
  createdAt?: string;
  hospital?: { id: string; name: string } | null;
  assignedDoctor?: Pick<
    IDoctor,
    'id' | 'firstName' | 'lastName' | 'email' | 'profilePicture'
  > | null;
}

export interface ICareAccessResponse {
  grants: ICareAccessGrant[];
  hospitalRelationships: ICareAccessHospitalPatient[];
}
