import { AppointmentView } from '@/hooks/useQueryParam';
import type { RemoteAppointmentChange } from '@/lib/features/appointments/appointmentsSlice';
import { IAppointment } from '@/types/appointment.interface';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { INotification, NotificationTopic } from '@/types/notification.interface';
import { Role } from '@/types/shared.enum';

const APPOINTMENT_LIST_TOPICS = new Set<NotificationTopic>([
  NotificationTopic.AppointmentRequest,
  NotificationTopic.AppointmentUpdate,
  NotificationTopic.DoctorAssigned,
  NotificationTopic.AssignmentNeeded,
  NotificationTopic.ClientAssigned,
  NotificationTopic.ConsultationUpdate,
  NotificationTopic.ConsultationStarted,
  NotificationTopic.ConsultationCompleted,
]);

export function getNotificationAppointmentId(
  payload: INotification['payload'],
): string | undefined {
  return payload.appointmentId || payload.requestId || payload.appointment?.id;
}

export function getNotificationPatientId(payload: INotification['payload']): string | undefined {
  return payload.patientId || payload.appointment?.patient?.id;
}

export function getRemoteAppointmentChange(data: unknown): RemoteAppointmentChange | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const notification = data as INotification;
  const payload = notification.payload;
  if (!payload) {
    return null;
  }

  if (payload.topic && !APPOINTMENT_LIST_TOPICS.has(payload.topic)) {
    return null;
  }

  const id = getNotificationAppointmentId(payload);
  if (!id) {
    return null;
  }

  const appointment = payload.appointment;
  const status = (appointment?.status ?? payload.status) as AppointmentStatus | undefined;

  return {
    patch: {
      id,
      status,
      doctor: appointment?.doctor,
      doctorId: payload.doctorId ?? appointment?.doctor?.id,
      meetingLink: payload.meetingLink ?? appointment?.meetingLink,
    },
    appointment: appointment as IAppointment | undefined,
  };
}

export function getNotificationDetailsHref(
  notification: INotification,
  role?: Role | null,
): string {
  const { topic } = notification.payload;
  const appointmentId = getNotificationAppointmentId(notification.payload);
  const patientId = getNotificationPatientId(notification.payload);

  const appointmentsHref = (view: AppointmentView = AppointmentView.Requests): string => {
    const params = new URLSearchParams({ appointmentView: view });
    if (appointmentId) {
      params.set('appointmentId', appointmentId);
    }
    return `/dashboard/appointment?${params.toString()}`;
  };

  const patientConsultationHref = appointmentId
    ? `/dashboard/consultation-patient/${appointmentId}`
    : '/dashboard/appointment';

  const doctorConsultationHref = (): string => {
    if (patientId && appointmentId) {
      return `/dashboard/consultation/${patientId}/${appointmentId}`;
    }
    if (appointmentId) {
      return `/dashboard/consultation/review?appointmentId=${appointmentId}`;
    }
    return appointmentsHref();
  };

  switch (topic) {
    case NotificationTopic.AppointmentRequest:
    case NotificationTopic.AppointmentUpdate:
    case NotificationTopic.DoctorAssigned:
    case NotificationTopic.AssignmentNeeded:
    case NotificationTopic.ClientAssigned:
      return appointmentsHref();

    case NotificationTopic.ConsultationStarted: {
      if (role === Role.Doctor) {
        return doctorConsultationHref();
      }
      return patientConsultationHref;
    }

    case NotificationTopic.ConsultationUpdate: {
      if (role === Role.Patient) {
        return patientConsultationHref;
      }
      if (role === Role.Doctor) {
        return doctorConsultationHref();
      }
      return appointmentsHref();
    }

    case NotificationTopic.ConsultationCompleted:
    case NotificationTopic.DiagnosisAdded:
    case NotificationTopic.LabRequest:
    case NotificationTopic.LabUpload:
    case NotificationTopic.RadiologyRequest:
    case NotificationTopic.PrescriptionGenerated: {
      if (role === Role.Doctor) {
        return appointmentId
          ? `/dashboard/consultation/review?appointmentId=${appointmentId}`
          : appointmentsHref();
      }
      return patientConsultationHref;
    }

    default: {
      if (appointmentId) {
        return appointmentsHref();
      }
      return '/dashboard/appointment';
    }
  }
}
