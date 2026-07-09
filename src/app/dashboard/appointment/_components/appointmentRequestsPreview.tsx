'use client';
import { AvatarWithName } from '@/components/ui/avatar';
import { TableData } from '@/components/ui/table';
import { selectUser, selectExtra } from '@/lib/features/auth/authSelector';
import { useAppSelector } from '@/lib/hooks';
import { IAppointment } from '@/types/appointment.interface';
import { OrderDirection, Role } from '@/types/shared.enum';
import { AppointmentStatus } from '@/types/appointmentStatus.enum';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { JSX, useMemo } from 'react';
import { StatusBadge } from '@/components/ui/statusBadge';
import { useFetchPaginatedData } from '@/hooks/useFetchPaginatedData';
import { getAppointments } from '@/lib/features/appointments/appointmentsThunk';
import type { IUser } from '@/types/auth.interface';

function createAppointmentRequestColumns(user: IUser | null): ColumnDef<IAppointment>[] {
  return [
    {
      accessorKey: 'patient',
      header: () => <PatientColumnHeader user={user} />,
      cell: ({ row }) => <PatientColumnCell row={row} user={user} />,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <DateColumnCell row={row} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusColumnCell row={row} />,
    },
  ];
}

function PatientColumnCell({
  row,
  user,
}: Readonly<{
  row: { original: IAppointment };
  user: IUser | null;
}>): JSX.Element {
  const { original } = row;
  const { doctor, patient } = original;
  const isDoctor = user?.role === Role.Doctor;
  const isHospital = user?.role === Role.Hospital;
  const isSuperAdmin = user?.role === Role.SuperAdmin;
  return (
    <AvatarWithName
      imageSrc={
        isDoctor || isSuperAdmin || isHospital ? patient.profilePicture : doctor.profilePicture
      }
      firstName={isDoctor || isSuperAdmin || isHospital ? patient.firstName : doctor.firstName}
      lastName={isDoctor || isSuperAdmin || isHospital ? patient.lastName : doctor.lastName}
    />
  );
}

function PatientColumnHeader({ user }: Readonly<{ user: IUser | null }>): JSX.Element {
  return (
    <div className="flex cursor-pointer whitespace-nowrap">
      {user?.role === Role.Doctor || user?.role === Role.Hospital || user?.role === Role.SuperAdmin
        ? 'Patient Name'
        : 'Doctor Name'}
    </div>
  );
}

function DateColumnCell({ row }: Readonly<{ row: { original: IAppointment } }>): string {
  return moment(row.original.slot.date).format('LL');
}

function StatusColumnCell({ row }: Readonly<{ row: { original: IAppointment } }>): JSX.Element {
  return (
    <StatusBadge
      status={row.original.status}
      approvedTitle="Accepted"
      destructiveTitle="Cancelled"
    />
  );
}

const AppointmentRequestsPreview = (): JSX.Element => {
  const user: IUser | null = useAppSelector(selectUser) ?? null;
  const extra = useAppSelector(selectExtra);
  // Get hospital ID from extra if user is a hospital
  const hospitalId =
    user?.role === Role.Hospital && extra && 'id' in extra
      ? (extra as { id: string }).id
      : undefined;

  const { isLoading, tableData } = useFetchPaginatedData<IAppointment, AppointmentStatus | ''>(
    getAppointments,
    {
      orderBy: 'createdAt',
      orderDirection: OrderDirection.Descending,
      doctorId: user?.role === Role.Doctor ? user?.id : undefined,
      patientId: user?.role === Role.Patient ? user?.id : undefined,
      orgId: user?.role === Role.Hospital ? hospitalId : undefined,
      page: 1,
      search: '',
      status: '',
      pageSize: 3, // Only fetch 3 items for preview
    },
  );

  const columns = useMemo(() => createAppointmentRequestColumns(user), [user]);

  return (
    <div>
      <TableData
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        rowCount={3}
        manualPagination={false}
      />
    </div>
  );
};

export default AppointmentRequestsPreview;
