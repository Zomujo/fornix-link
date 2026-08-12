import { Role } from '@/types/shared.enum';
import { IAppointment, IRecordRequest } from '@/types/appointment.interface';

export interface INotification {
  id: number;
  event: NotificationEvent;
  fromId: string;
  toId: string;
  userId: string;
  payload: IPayload;
  read: boolean;
  createdAt: string;
}

interface IPayload {
  topic: NotificationTopic;
  requestId: string;
  scope: Role;
  message: string;
  appointmentId: string;
  appointment: IAppointment;
  request: IRecordRequest;
}

export enum NotificationEvent {
  NewNotification = 'newNotification',
  NewRequest = 'newRequest',
  RecordRequest = 'recordRequest',
  DoctorAssigned = 'doctorAssigned',
  AssignmentNeeded = 'assignmentNeeded',
}

export enum NotificationTopic {
  LabRequest = 'Lab Test Requests',
  LabUpload = 'Lab Picture Upload',
  DoctorApproved = 'Doctor Approval Status',
  PrescriptionGenerated = 'Prescription Generated',
  ConsultationUpdate = 'Consultation Update',
  ConsultationStarted = 'Consultation Started',
  ConsultationCompleted = 'Consultation Completed',
  DiagnosisAdded = 'Diagnosis Added',
  RadiologyRequest = 'Radiology Test Requests',
  DoctorAssigned = 'Doctor Assigned',
  AssignmentNeeded = 'Assignment Needed',
  ClientAssigned = 'Client Assigned',
  AppointmentRequest = 'Appointment Request',
  AppointmentUpdate = 'Appointment Update',
}
