import moment, { Moment } from 'moment';
import { IAppointment } from '@/types/appointment.interface';
import { IHospitalAppointment } from '@/types/hospital-appointment.interface';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { AppointmentType } from '@/types/slots.interface';
import { Role } from '@/types/shared.enum';

export type AppointmentLike = IAppointment | IHospitalAppointment;

export type AppointmentParty = {
  firstName: string;
  lastName: string;
  imageSrc?: string;
  email?: string;
  contact?: string;
};

export function getAppointmentType(appointment: AppointmentLike): AppointmentType | undefined {
  if ('type' in appointment && appointment.type) {
    return appointment.type;
  }
  return appointment.slot?.type;
}

export type AppointmentHospital = {
  id: string;
  name: string;
  mainEmail?: string;
  images?: { url: string; type: string }[] | { url: string; type: string } | (string | File)[];
};

export function getAppointmentHospital(appointment: AppointmentLike): AppointmentHospital | null {
  if ('hospital' in appointment && appointment.hospital) {
    return appointment.hospital as AppointmentHospital;
  }
  return null;
}

export function getHospitalLogoUrl(hospital?: AppointmentHospital | null): string | undefined {
  if (!hospital?.images) {
    return undefined;
  }
  const images = Array.isArray(hospital.images) ? hospital.images : [hospital.images];
  const normalized = images
    .map((img) => {
      if (typeof img === 'string') {
        return { url: img, type: '' };
      }
      if (img instanceof File) {
        return null;
      }
      return img;
    })
    .filter((img): img is { url: string; type: string } => Boolean(img?.url));
  const logo = normalized.find((img) => img.type === 'logo') ?? normalized[0];
  return logo?.url;
}

/** Who the current user sees in the primary name column (counterparty). */
export function getAppointmentCounterparty(
  appointment: AppointmentLike,
  role?: Role | null,
): AppointmentParty {
  const { doctor, patient } = appointment;
  const hospital = getAppointmentHospital(appointment);
  const seesPatient = role === Role.Doctor || role === Role.Hospital || role === Role.SuperAdmin;

  if (seesPatient) {
    return {
      firstName: patient?.firstName ?? '',
      lastName: patient?.lastName ?? '',
      imageSrc: patient?.profilePicture,
      email: patient?.email,
      contact: patient?.contact,
    };
  }

  if (doctor?.firstName || doctor?.lastName) {
    return {
      firstName: doctor.firstName ?? '',
      lastName: doctor.lastName ?? '',
      imageSrc: doctor.profilePicture,
      email: doctor.email,
      contact: doctor.contact,
    };
  }

  if (hospital?.name) {
    return {
      firstName: hospital.name,
      lastName: '',
      imageSrc: getHospitalLogoUrl(hospital),
      email: hospital.mainEmail,
    };
  }

  return { firstName: '', lastName: '' };
}

export function getAppointmentCounterpartyLabel(role?: Role | null): string {
  if (role === Role.Doctor || role === Role.Hospital || role === Role.SuperAdmin) {
    return 'Patient Name';
  }
  return 'Provider';
}

export function getAppointmentProviderName(appointment: AppointmentLike): string {
  const { doctor } = appointment;
  if (doctor?.firstName || doctor?.lastName) {
    return `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim();
  }
  return getAppointmentHospital(appointment)?.name ?? 'Hospital';
}

export function canJoinMeeting(appointment: AppointmentLike): boolean {
  const { status } = appointment;
  const isDone = status === AppointmentStatus.Completed;
  const isCancelled =
    status === AppointmentStatus.Cancelled || status === AppointmentStatus.Declined;
  const isVirtual = getAppointmentType(appointment) === AppointmentType.Virtual;
  const hasScheduledSlot = Boolean(appointment.slot?.date && appointment.slot?.startTime);

  // Visit / hospital appointments have no Google Meet link
  return !isDone && !isCancelled && isVirtual && hasScheduledSlot && Boolean(appointment.doctor);
}

export function getAppointmentMeetingLink(appointment: AppointmentLike): string | undefined {
  if ('meetingLink' in appointment && typeof appointment.meetingLink === 'string') {
    const link = appointment.meetingLink.trim();
    return link || undefined;
  }
  return undefined;
}

export function getAppointmentContact(appointment: AppointmentLike): string | undefined {
  const patientContact = appointment.patient?.contact?.trim();
  if (patientContact) {
    return patientContact;
  }

  if (appointment.additionalInfo) {
    const contactMatch = /Contact:\s*(.+)/.exec(appointment.additionalInfo);
    if (contactMatch) {
      const contact = contactMatch[1].trim();
      if (contact) {
        return contact;
      }
    }
  }

  return undefined;
}

export function getAppointmentDateValue(appointment: AppointmentLike): string {
  if (appointment.slot?.date) {
    return appointment.slot.date;
  }
  if ('appointmentDate' in appointment && appointment.appointmentDate) {
    return appointment.appointmentDate;
  }
  if (appointment.additionalInfo) {
    const dateMatch = /Appointment Date: (.+)/.exec(appointment.additionalInfo);
    if (dateMatch) {
      return dateMatch[1].trim();
    }
  }
  return appointment.createdAt;
}

export function getAppointmentMoment(appointment: AppointmentLike): Moment {
  return moment(getAppointmentDateValue(appointment));
}

export function isAppointmentOnSameDay(appointment: AppointmentLike, date: Date): boolean {
  return getAppointmentMoment(appointment).isSame(date, 'day');
}
