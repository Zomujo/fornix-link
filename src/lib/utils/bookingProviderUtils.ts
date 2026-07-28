import { IBookingProvider } from '@/types/bookingProvider.interface';

export function getHospitalRegularFee(accreditations?: unknown): number {
  if (!accreditations || typeof accreditations !== 'object' || Array.isArray(accreditations)) {
    return 0;
  }
  const fee = (accreditations as { regularFee?: unknown }).regularFee;
  const parsed = typeof fee === 'number' ? fee : Number(fee);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function buildHospitalBookingProvider(hospital: {
  id: string;
  name: string;
  accreditations?: unknown;
  images?: { type: string; url: string }[];
  organizationType?: string;
}): IBookingProvider {
  const logo = hospital.images?.find((img) => img.type === 'logo');
  return {
    type: 'hospital',
    id: hospital.id,
    name: hospital.name,
    fee: getHospitalRegularFee(hospital.accreditations),
    image: logo?.url ?? null,
    subtitle: hospital.organizationType,
  };
}

export function buildDoctorBookingProvider(doctor: {
  id: string;
  firstName: string;
  lastName: string;
  fee?: number;
  profilePicture?: string | null;
  specializations?: string[];
}): IBookingProvider {
  return {
    type: 'doctor',
    id: doctor.id,
    name: `${doctor.firstName} ${doctor.lastName}`,
    fee: doctor.fee ?? 0,
    image: doctor.profilePicture,
    subtitle: doctor.specializations?.[0],
  };
}
