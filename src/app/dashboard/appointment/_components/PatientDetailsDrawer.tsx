'use client';
import React, { JSX, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AvatarWithName } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/statusBadge';
import { IAppointment } from '@/types/appointment.interface';
import { IHospitalAppointment } from '@/types/hospital-appointment.interface';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Info,
  Signature,
  Ban,
  X,
  RotateCcw,
} from 'lucide-react';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectUser } from '@/lib/features/auth/authSelector';
import {
  acceptAppointment,
  cancelAppointment,
  declineAppointment,
  reopenAppointment,
} from '@/lib/features/appointments/appointmentsThunk';
import { reopenHospitalAppointment } from '@/lib/features/hospital-appointments/hospitalAppointmentsThunk';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { Role } from '@/types/shared.enum';
import { toast, Toast } from '@/hooks/use-toast';
import { showErrorToast } from '@/lib/utils';
import { getAppointmentCounterparty } from '@/lib/utils/appointmentUtils';

type PatientDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  appointment: IAppointment | IHospitalAppointment | null;
  isHospital?: boolean;
  onActionComplete?: () => void;
};

const PatientDetailsDrawer = ({
  open,
  onClose,
  appointment,
  isHospital = false,
  onActionComplete,
}: PatientDetailsDrawerProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isApproving, setIsApproving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const isPatientViewer = user?.role === Role.Patient;

  if (!appointment) {
    return <></>;
  }

  const { reason, additionalInfo, status, slot, createdAt, id } = appointment;
  const contact = getAppointmentCounterparty(appointment, user?.role);
  const isPending = status === AppointmentStatus.Pending;
  const isDone = status === AppointmentStatus.Completed;
  const isCancelled = status === AppointmentStatus.Cancelled;
  const canApprove = !isPatientViewer && isPending;
  const canCancel = !isDone && !isCancelled;
  const canReopen = !isPatientViewer && isCancelled;

  const handleApprove = async (): Promise<void> => {
    setIsApproving(true);
    const { payload } = await dispatch(acceptAppointment(id));

    if (payload && showErrorToast(payload)) {
      toast(payload as Toast);
    } else {
      toast(payload as Toast);
      if (onActionComplete) {
        onActionComplete();
      }
      onClose();
    }
    setIsApproving(false);
  };

  const handleCancel = async (): Promise<void> => {
    setIsCancelling(true);
    const cancelAction = isPatientViewer ? cancelAppointment(id) : declineAppointment(id);
    const { payload } = await dispatch(cancelAction);

    if (payload && showErrorToast(payload)) {
      toast(payload as Toast);
    } else {
      toast(payload as Toast);
      if (onActionComplete) {
        onActionComplete();
      }
      onClose();
    }
    setIsCancelling(false);
  };

  const handleReopen = async (): Promise<void> => {
    setIsReopening(true);
    const reopenAction = isHospital ? reopenHospitalAppointment(id) : reopenAppointment(id);
    const { payload } = await dispatch(reopenAction);

    if (payload && showErrorToast(payload)) {
      toast(payload as Toast);
    } else {
      toast(payload as Toast);
      if (onActionComplete) {
        onActionComplete();
      }
      onClose();
    }
    setIsReopening(false);
  };

  // Format appointment date/time
  const getAppointmentDateTime = (): string => {
    if (slot?.date) {
      const date = moment(slot.date).format('LL');
      const time = slot.startTime ? moment(slot.startTime, 'HH:mm:ss').format('h:mm A') : '';
      return time ? `${date} at ${time}` : date;
    }
    // For hospital appointments without slots, try to extract from additionalInfo
    if (additionalInfo) {
      const dateRegex = /Appointment Date: (.+)/;
      const dateMatch = dateRegex.exec(additionalInfo);
      if (dateMatch) {
        const dateStr = dateMatch[1].trim();
        // Try to parse and format the date
        const parsedDate = moment(dateStr);
        if (parsedDate.isValid()) {
          return parsedDate.format('LL');
        }
        return dateStr;
      }
    }
    return moment(createdAt).format('LL');
  };

  // Format additional info text, converting ISO dates to human-readable format
  const formatAdditionalInfo = (text: string): string => {
    if (!text) {
      return text;
    }

    // Pattern to match ISO 8601 date strings (e.g., "2026-01-24T00:00:00.000Z" or "2026-01-24T00:00:00Z")
    // This will match dates in various ISO formats
    const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?/g;

    return text.replaceAll(isoDatePattern, (match) => {
      const parsedDate = moment(match);
      if (parsedDate.isValid()) {
        return parsedDate.format('LL');
      }
      return match;
    });
  };

  return (
    <Drawer direction="right" open={open}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md overflow-y-auto p-4">
          <DrawerHeader className="relative">
            <DrawerClose
              onClick={onClose}
              disabled={isApproving || isCancelling || isReopening}
              className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[disabled]:pointer-events-none"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </DrawerClose>
            <DrawerTitle className="pr-8 text-xl">
              {isPatientViewer ? 'Provider Contact Information' : 'Patient Contact Information'}
            </DrawerTitle>
            <DrawerDescription>
              {isPatientViewer
                ? 'View doctor or hospital details and appointment information'
                : 'View patient details and appointment information'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-6 space-y-6">
            {/* Patient Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>

              <div className="flex items-center gap-3">
                <AvatarWithName
                  imageSrc={contact.imageSrc}
                  firstName={contact.firstName}
                  lastName={contact.lastName}
                />
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-400">N/A</p>
                  )}
                </div>
              </div>

              {/* Phone/Contact */}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  {contact.contact ? (
                    <a
                      href={`tel:${contact.contact}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {contact.contact}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-400">N/A</p>
                  )}
                </div>
              </div>

              {/* Address */}
              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">{contact.address}</p>
                  </div>
                </div>
              )}

              {/* City */}
              {contact.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-sm font-medium">{contact.city}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Details Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2 border-b pb-3">
                <h3 className="text-lg font-semibold">Appointment Details</h3>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={status}
                      approvedTitle="Accepted"
                      destructiveTitle="Cancelled"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Date/Time */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Appointment Date & Time</p>
                  <p className="text-sm font-medium">{getAppointmentDateTime()}</p>
                </div>
              </div>

              {/* Reason */}
              {reason && (
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="text-sm font-medium">{reason}</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {additionalInfo && (
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Additional Information</p>
                    <p className="text-sm font-medium whitespace-pre-wrap">
                      {formatAdditionalInfo(additionalInfo)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(canApprove || canCancel || canReopen) && (
            <DrawerFooter className="flex flex-col gap-2">
              <div className="flex gap-2">
                {canApprove && (
                  <Button
                    variant="default"
                    onClick={handleApprove}
                    className="flex-1"
                    isLoading={isApproving}
                    disabled={isApproving || isCancelling || isReopening}
                    child={
                      <>
                        <Signature className="mr-2 h-4 w-4" /> Approve
                      </>
                    }
                  />
                )}
                {canCancel && (
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    className="flex-1"
                    isLoading={isCancelling}
                    disabled={isApproving || isCancelling || isReopening}
                    child={
                      <>
                        <Ban className="mr-2 h-4 w-4" /> Cancel
                      </>
                    }
                  />
                )}
                {canReopen && (
                  <Button
                    variant="default"
                    onClick={handleReopen}
                    className="flex-1"
                    isLoading={isReopening}
                    disabled={isApproving || isCancelling || isReopening}
                    child={
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" /> Reopen
                      </>
                    }
                  />
                )}
              </div>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PatientDetailsDrawer;
