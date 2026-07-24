'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Confirmation, ConfirmationProps, Modal } from '@/components/ui/dialog';
import { OptionsMenu, ActionsDropdownMenus, ISelected } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TableData } from '@/components/ui/table';
import { useAppDispatch } from '@/lib/hooks';
import { AcceptDeclineStatus } from '@/types/shared.enum';
import { ColumnDef } from '@tanstack/react-table';
import {
  Binoculars,
  CalendarX,
  ListFilter,
  Search,
  SendHorizontal,
  ShieldCheck,
} from 'lucide-react';
import React, { FormEvent, JSX, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { showErrorToast, capitalize } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { useDropdownAction } from '@/hooks/useDropdownAction';
import {
  activateHospital,
  deactivateHospital,
  getAllHospitalsAdmin,
  getHospitalByIdAdmin,
} from '@/lib/features/hospitals/hospitalThunk';
import {
  IHospitalDetail,
  IHospitalListItem,
  OrganizationType as HospitalOrgType,
} from '@/types/hospital.interface';
import { getFormattedDate } from '@/lib/date';
import { useFetchPaginatedData } from '@/hooks/useFetchPaginatedData';
import { useRouter } from 'next/navigation';
import { getHospitalDetailPath } from '@/components/hospital/hospitalPaths';

const hospitalStatusFilterOptions: ISelected[] = [
  { value: '', label: 'All' },
  { value: AcceptDeclineStatus.Accepted, label: 'Public' },
  { value: AcceptDeclineStatus.Deactivated, label: 'Hidden' },
];

const getOrganizationTypeLabel = (type?: string): string => {
  switch (type) {
    case HospitalOrgType.Private:
    case 'private':
      return 'Private';
    case HospitalOrgType.Public:
    case 'public':
      return 'Public';
    case HospitalOrgType.Teaching:
    case 'teaching':
      return 'Teaching';
    case HospitalOrgType.Clinic:
    case 'clinic':
      return 'Clinic';
    default:
      return type ? capitalize(type) : 'Hospital';
  }
};

function isOwnerVerified(hospital: {
  ownerUser?: { status?: string } | null;
}): boolean {
  // Seed hospitals with no owner remain eligible for public listing.
  if (!hospital.ownerUser) return true;
  return hospital.ownerUser.status === 'verified';
}

const HospitalPanel = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedHospital, setSelectedHospital] = useState<IHospitalDetail | null>(null);
  const [selectedOwnerVerified, setSelectedOwnerVerified] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationProps>({
    acceptCommand: () => {},
    rejectCommand: () => {},
    description: '',
    open: false,
  });
  const { searchTerm, handleSearch } = useSearch(handleSubmit);
  const { isLoading, setQueryParameters, paginationData, queryParameters, tableData, updatePage } =
    useFetchPaginatedData<IHospitalListItem>(getAllHospitalsAdmin);

  const columns: ColumnDef<IHospitalListItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'organizationType',
      header: 'Type',
      cell: ({ row: { original } }): string => getOrganizationTypeLabel(original.organizationType),
    },
    {
      accessorKey: 'primaryAddress.city',
      header: 'City',
      cell: ({ row: { original } }): string => original.primaryAddress?.city || '—',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row: { original } }): JSX.Element => {
        if (!isOwnerVerified(original)) {
          return <Badge variant="secondary">Unverified</Badge>;
        }
        return original.isActive ? (
          <Badge variant="default">Public</Badge>
        ) : (
          <Badge variant="destructive">Hidden</Badge>
        );
      },
    },
    {
      accessorKey: 'ownerUser.email',
      header: 'Owner Email',
      cell: ({ row: { original } }): string => original.ownerUser?.email || '—',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date Created',
      cell: ({ row: { original } }): string =>
        original.createdAt ? getFormattedDate(new Date(original.createdAt)) : '—',
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row: { original } }): JSX.Element => {
        const { isActive, id, name } = original;
        const ownerVerified = isOwnerVerified(original);
        return (
          <ActionsDropdownMenus
            menuContent={[
              {
                title: (
                  <>
                    <Binoculars /> View
                  </>
                ),
                clickCommand: () => void handleView(id, ownerVerified),
              },
              {
                title: (
                  <>
                    <ShieldCheck /> Activate
                  </>
                ),
                visible: !isActive && ownerVerified,
                clickCommand: () =>
                  handleConfirmationOpen(
                    'Activate',
                    `make ${name} publicly visible`,
                    id,
                    activateHospital,
                  ),
              },
              {
                title: (
                  <>
                    <CalendarX /> Deactivate
                  </>
                ),
                visible: isActive,
                clickCommand: () =>
                  handleConfirmationOpen(
                    'Deactivate',
                    `hide ${name} from public listings`,
                    id,
                    deactivateHospital,
                  ),
              },
            ]}
          />
        );
      },
      enableHiding: false,
    },
  ];

  async function handleView(hospitalId: string, ownerVerified = true): Promise<void> {
    setIsLoadingDetail(true);
    setOpenModal(true);
    setSelectedOwnerVerified(ownerVerified);
    const { payload } = await dispatch(getHospitalByIdAdmin(hospitalId));
    setIsLoadingDetail(false);
    if (payload && showErrorToast(payload)) {
      toast(payload);
      setOpenModal(false);
      return;
    }
    setSelectedHospital(payload as IHospitalDetail);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, search?: string): void {
    event.preventDefault();
    setQueryParameters((prev) => ({
      ...prev,
      page: 1,
      search: search ?? searchTerm,
    }));
  }

  const { isConfirmationLoading, handleConfirmationOpen, handleConfirmationClose } =
    useDropdownAction({
      setConfirmation,
      setQueryParameters,
    });

  return (
    <>
      <div className="mt-4 rounded-lg bg-white">
        <div className="p-6">
          <div className="mb-4 flex flex-wrap justify-between">
            <div className="mb-2 flex gap-2">
              <form className="flex" onSubmit={handleSubmit}>
                <Input
                  error=""
                  placeholder="Search Hospital"
                  className="max-w-[333px] sm:w-[333px]"
                  type="search"
                  leftIcon={<Search className="text-gray-500" size={20} />}
                  onChange={handleSearch}
                />
                {searchTerm && <Button child={<SendHorizontal />} className="ml-2" />}
              </form>
              <OptionsMenu
                options={hospitalStatusFilterOptions}
                Icon={ListFilter}
                menuTrigger="Filter"
                selected={queryParameters.status}
                setSelected={(value: string) =>
                  setQueryParameters((prev) => ({
                    ...prev,
                    page: 1,
                    status: value as AcceptDeclineStatus,
                  }))
                }
                className="h-10 cursor-pointer bg-gray-50 sm:flex"
              />
            </div>
          </div>
          <TableData
            columns={columns}
            data={tableData}
            page={queryParameters.page}
            userPaginationChange={({ pageIndex }) => updatePage(pageIndex)}
            paginationData={paginationData}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Modal
        open={openModal}
        content={
          <div className="relative flex flex-col">
            {isLoadingDetail || !selectedHospital ? (
              <div className="flex min-h-40 items-center justify-center text-sm text-gray-500">
                Loading hospital details...
              </div>
            ) : (
              <div className="space-y-4 p-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedHospital.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {getOrganizationTypeLabel(selectedHospital.organizationType)}
                    {selectedHospital.primaryAddress?.city
                      ? ` · ${selectedHospital.primaryAddress.city}`
                      : ''}
                  </p>
                </div>
                {selectedHospital.description && (
                  <p className="text-sm text-gray-600">{selectedHospital.description}</p>
                )}
                <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {selectedHospital.mainEmail || '—'}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{' '}
                    {selectedHospital.mainPhone || '—'}
                  </p>
                  <p>
                    <span className="font-medium">Public status:</span>{' '}
                    {!selectedOwnerVerified
                      ? 'Unverified'
                      : selectedHospital.isActive
                        ? 'Public'
                        : 'Hidden'}
                  </p>
                  <p>
                    <span className="font-medium">Website:</span>{' '}
                    {selectedHospital.website || '—'}
                  </p>
                </div>
              </div>
            )}
            {selectedHospital?.isActive && selectedOwnerVerified && (
              <div className="sticky right-0 bottom-0 left-0 z-20 flex justify-center gap-3 border-t bg-white p-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setOpenModal(false);
                    router.push(getHospitalDetailPath(selectedHospital.slug, 'dashboard'));
                  }}
                  child="View Full Profile"
                />
              </div>
            )}
          </div>
        }
        className="max-h-screen max-w-screen overflow-y-scroll md:max-h-[90vh] md:max-w-[80vw]"
        setState={setOpenModal}
        showClose={true}
      />

      <Confirmation
        {...confirmation}
        showClose={true}
        setState={() => handleConfirmationClose()}
        isLoading={isConfirmationLoading}
      />
    </>
  );
};

export default HospitalPanel;
