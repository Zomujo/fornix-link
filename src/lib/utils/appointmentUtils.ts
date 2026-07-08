import moment, { Moment } from 'moment';
import { IAppointment } from '@/types/appointment.interface';
import { IHospitalAppointment } from '@/types/hospital-appointment.interface';

export type AppointmentLike = IAppointment | IHospitalAppointment;

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
