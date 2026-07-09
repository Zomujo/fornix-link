import moment, { Moment } from 'moment';
import { IAppointment } from '@/types/appointment.interface';
import { IHospitalAppointment } from '@/types/hospital-appointment.interface';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { AppointmentType } from '@/types/slots.interface';

export type AppointmentLike = IAppointment | IHospitalAppointment;

export function getAppointmentType(appointment: AppointmentLike): AppointmentType | undefined {
  if ('type' in appointment && appointment.type) {
    return appointment.type;
  }
  return appointment.slot?.type;
}

export function canJoinMeeting(appointment: AppointmentLike): boolean {
  const { status } = appointment;
  const isDone = status === AppointmentStatus.Completed;
  const isCancelled =
    status === AppointmentStatus.Cancelled || status === AppointmentStatus.Declined;
  const isVirtual = getAppointmentType(appointment) === AppointmentType.Virtual;
  const hasScheduledSlot = Boolean(appointment.slot?.date && appointment.slot?.startTime);

  return !isDone && !isCancelled && isVirtual && hasScheduledSlot;
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
