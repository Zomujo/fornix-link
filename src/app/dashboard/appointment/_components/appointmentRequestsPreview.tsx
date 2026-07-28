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
import {
  getAppointmentCounterparty,
  getAppointmentCounterpartyLabel,
} from '@/lib/utils/appointmentUtils';

function createAppointmentRequestColumns(user: IUser | null): ColumnDef<IAppointment>[] {
  return [
    {
      accessorKey: 'patient',
      header: () => (
        <div className="flex cursor-pointer whitespace-nowrap">
          {getAppointmentCounterpartyLabel(user?.role)}
        </div>
      ),
      cell: ({ row }): JSX.Element => {
        const person = getAppointmentCounterparty(row.original, user?.role);
        return (
          <AvatarWithName
            imageSrc={person.imageSrc}
            firstName={person.firstName}
            lastName={person.lastName}
          />
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }): string =>
        row.original.slot?.date
          ? moment(row.original.slot.date).format('LL')
          : moment(row.original.createdAt).format('LL'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }): JSX.Element => (
        <StatusBadge
          status={row.original.status}
          approvedTitle="Accepted"
          destructiveTitle="Cancelled"
        />
      ),
    },
  ];
}

const AppointmentRequestsPreview = (): JSX.Element => {
  const user: IUser | null = useAppSelector(selectUser) ?? null;
  const extra = useAppSelector(selectExtra);
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
      pageSize: 3,
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
