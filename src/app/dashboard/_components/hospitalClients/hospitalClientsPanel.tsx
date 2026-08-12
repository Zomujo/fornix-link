'use client';

import { AvatarWithName } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TableData } from '@/components/ui/table';
import { useSearch } from '@/hooks/useSearch';
import { useFetchPaginatedData } from '@/hooks/useFetchPaginatedData';
import { useAppDispatch } from '@/lib/hooks';
import {
  assignHospitalPatient,
  getHospitalPatients,
  getHospitalStaffDoctors,
} from '@/lib/features/hospital-patients/hospitalPatientsThunk';
import { showErrorToast } from '@/lib/utils';
import { IHospitalPatient, IHospitalStaffDoctor } from '@/types/hospital-patient.interface';
import { OrderDirection } from '@/types/shared.enum';
import { Toast, toast } from '@/hooks/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Search, SendHorizontal, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { JSX, SyntheticEvent, useEffect, useState } from 'react';

const HospitalClientsPanel = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IHospitalPatient | null>(null);
  const [staffDoctors, setStaffDoctors] = useState<IHospitalStaffDoctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const {
    isLoading,
    setQueryParameters,
    paginationData,
    queryParameters,
    tableData,
    updatePage,
    refetch,
  } = useFetchPaginatedData<IHospitalPatient>(getHospitalPatients, {
    orderBy: 'createdAt',
    orderDirection: OrderDirection.Descending,
    page: 1,
    search: '',
  });

  const { searchTerm, handleSearch } = useSearch(handleSubmit);

  useEffect(() => {
    if (!assignOpen) {
      return;
    }
    const loadDoctors = async (): Promise<void> => {
      setIsLoadingDoctors(true);
      const { payload } = await dispatch(getHospitalStaffDoctors());
      setIsLoadingDoctors(false);
      if (payload && showErrorToast(payload)) {
        toast(payload as Toast);
        return;
      }
      setStaffDoctors((payload as IHospitalStaffDoctor[]) ?? []);
    };
    void loadDoctors();
  }, [assignOpen, dispatch]);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>, search?: string): void {
    event.preventDefault();
    setQueryParameters((prev) => ({
      ...prev,
      page: 1,
      search: search ?? searchTerm,
    }));
  }

  function openAssignDrawer(client: IHospitalPatient): void {
    setSelectedClient(client);
    setSelectedDoctorId(client.assignedDoctorId ?? '');
    setAssignOpen(true);
  }

  async function handleAssign(): Promise<void> {
    if (!selectedClient || !selectedDoctorId) {
      return;
    }
    setIsAssigning(true);
    const { payload } = await dispatch(
      assignHospitalPatient({
        patientId: selectedClient.patientId,
        doctorId: selectedDoctorId,
      }),
    );
    setIsAssigning(false);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setAssignOpen(false);
      setSelectedClient(null);
      setSelectedDoctorId('');
      void refetch();
    }
  }

  const columns: ColumnDef<IHospitalPatient>[] = [
    {
      accessorKey: 'patient',
      header: 'Name',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => { //NOSONAR
        const patient = original.patient;
        return (
          <AvatarWithName
            imageSrc={patient?.profilePicture ?? ''}
            firstName={patient?.firstName ?? ''}
            lastName={patient?.lastName ?? ''}
          />
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }): string => original.patient?.email ?? '—',
    },
    {
      accessorKey: 'assignedDoctor',
      header: 'Assigned Doctor',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element | string => { //NOSONAR
        const doctor = original.assignedDoctor;
        if (!doctor) {
          return '—';
        }
        return (
          <AvatarWithName
            imageSrc={doctor.profilePicture ?? ''}
            firstName={doctor.firstName}
            lastName={doctor.lastName}
          />
        );
      },
    },
    {
      accessorKey: 'unassigned',
      header: 'Status',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => { //NOSONAR
        const unassigned = original.unassigned ?? !original.assignedDoctorId;
        return unassigned ? (
          <Badge variant="destructive">Unassigned</Badge>
        ) : (
          <Badge variant="default">Assigned</Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => { //NOSONAR
        const unassigned = original.unassigned ?? !original.assignedDoctorId;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              child={
                <span className="inline-flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  {unassigned ? 'Assign' : 'Reassign'}
                </span>
              }
              onClick={() => openAssignDrawer(original)}
            />
            <button
              type="button"
              className="hover:text-primary cursor-pointer"
              title="View patient"
              onClick={() => router.push(`/dashboard/patients/${original.patientId}`)}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-4 rounded-lg bg-white p-6">
      <p className="mb-6 text-xl font-bold">Hospital Clients</p>
      <div className="flex justify-between">
        <form className="flex" onSubmit={handleSubmit}>
          <Input
            error=""
            placeholder="Search by patient name or email"
            className="max-w-83.25 sm:w-83.25"
            type="search"
            leftIcon={<Search className="cursor-pointer text-gray-500" size={20} />}
            onChange={handleSearch}
          />
          {searchTerm && <Button child={<SendHorizontal />} className="-ml-8" />}
        </form>
      </div>
      <div className="mt-5">
        <TableData
          columns={columns}
          page={queryParameters.page}
          data={tableData}
          paginationData={paginationData}
          userPaginationChange={({ pageIndex }) => updatePage(pageIndex)}
          isLoading={isLoading}
        />
      </div>

      <Drawer
        direction="right"
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open);
          if (!open) {
            setSelectedClient(null);
            setSelectedDoctorId('');
          }
        }}
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader className="relative">
              <DrawerClose
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setAssignOpen(false)}
              >
                <X className="h-5 w-5" />
              </DrawerClose>
              <DrawerTitle className="pr-8 text-xl">
                {selectedClient?.assignedDoctorId ? 'Reassign Doctor' : 'Assign Doctor'}
              </DrawerTitle>
              <DrawerDescription>
                {selectedClient?.patient
                  ? `Select a doctor for ${selectedClient.patient.firstName} ${selectedClient.patient.lastName}`
                  : 'Select an active hospital doctor'}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              {isLoadingDoctors ? (
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  ))}
                </div>
              ) : (
                <div className="mt-2 max-h-75 overflow-y-auto">
                  <RadioGroup value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                    {staffDoctors.map((staff) => {
                      const doctorId = staff.doctorId ?? staff.doctor?.id;
                      if (!doctorId) {
                        return null;
                      }
                      const firstName = staff.doctor?.firstName ?? staff.user?.firstName ?? '';
                      const lastName = staff.doctor?.lastName ?? staff.user?.lastName ?? '';
                      return (
                        <div className="mt-2 flex items-center space-x-2" key={staff.id}>
                          <RadioGroupItem value={doctorId} id={doctorId} />
                          <Label htmlFor={doctorId} className="font-normal">
                            {firstName} {lastName}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {!staffDoctors.length && (
                    <p className="text-sm text-gray-500">No active doctors on staff.</p>
                  )}
                </div>
              )}
            </div>
            <DrawerFooter className="flex flex-row justify-end gap-2">
              <Button child="Cancel" variant="ghost" onClick={() => setAssignOpen(false)} />
              <Button
                child={selectedClient?.assignedDoctorId ? 'Reassign' : 'Assign'}
                onClick={() => void handleAssign()}
                disabled={!selectedDoctorId || isAssigning}
                isLoading={isAssigning}
              />
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default HospitalClientsPanel;
