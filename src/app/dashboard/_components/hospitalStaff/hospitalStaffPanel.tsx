'use client';

import { AvatarWithName } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Confirmation, ConfirmationProps, Modal } from '@/components/ui/dialog';
import { ActionsDropdownMenus, ISelected, OptionsMenu } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SelectInputV2 } from '@/components/ui/select';
import { TableData } from '@/components/ui/table';
import InviteUser, { InviteUserForm } from '@/app/dashboard/_components/inviteUser';
import { useSearch } from '@/hooks/useSearch';
import { Toast, toast } from '@/hooks/use-toast';
import {
  getHospitalStaff,
  inviteHospitalStaff,
  reactivateHospitalStaff,
  removeHospitalStaff,
  suspendHospitalStaff,
  updateHospitalStaffRole,
} from '@/lib/features/hospital-staff/hospitalStaffThunk';
import { useAppDispatch } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import {
  HospitalStaffRole,
  HospitalStaffStatus,
  IHospitalStaffMember,
  InviteHospitalStaffRole,
} from '@/types/hospital-staff.interface';
import { ColumnDef } from '@tanstack/react-table';
import { ListFilter, Lock, Search, SendHorizontal, UserRoundPlus } from 'lucide-react';
import React, { JSX, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

const ROLE_FILTER_OPTIONS: ISelected[] = [
  { value: '', label: 'All roles' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
];

const STATUS_FILTER_OPTIONS: ISelected[] = [
  { value: '', label: 'All statuses' },
  { value: 'invited', label: 'Invited' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'removed', label: 'Removed' },
];

function statusBadgeVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'brown' | 'blue' | 'gray' {
  switch (status) {
    case 'active':
      return 'default';
    case 'invited':
      return 'blue';
    case 'suspended':
      return 'brown';
    case 'removed':
      return 'destructive';
    default:
      return 'gray';
  }
}

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'blue' | 'gray' {
  switch (role) {
    case 'owner':
      return 'default';
    case 'admin':
      return 'blue';
    default:
      return 'secondary';
  }
}

function staffDisplayName(staff: IHospitalStaffMember): {
  firstName: string;
  lastName: string;
  email: string;
  imageSrc: string;
} {
  return {
    firstName: staff.doctor?.firstName ?? staff.user?.firstName ?? '',
    lastName: staff.doctor?.lastName ?? staff.user?.lastName ?? '',
    email: staff.doctor?.email ?? staff.user?.email ?? '',
    imageSrc: staff.doctor?.profilePicture ?? '',
  };
}

const HospitalStaffPanel = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [staff, setStaff] = useState<IHospitalStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<HospitalStaffRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<HospitalStaffStatus | ''>('');
  const [roleModalStaff, setRoleModalStaff] = useState<IHospitalStaffMember | null>(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<InviteHospitalStaffRole>('doctor');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationProps>({
    acceptCommand: () => {},
    rejectCommand: () => {},
    description: '',
    open: false,
  });
  const [isConfirmationLoading, setIsConfirmationLoading] = useState(false);

  const { searchTerm, handleSearch } = useSearch();

  const loadStaff = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const { payload } = await dispatch(
      getHospitalStaff({
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      }),
    );
    setIsLoading(false);
    if (payload && showErrorToast(payload)) {
      toast(payload as Toast);
      setStaff([]);
      return;
    }
    setStaff((payload as IHospitalStaffMember[]) ?? []);
  }, [dispatch, roleFilter, statusFilter]);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    if (!openRoleModal) {
      setRoleModalStaff(null);
    }
  }, [openRoleModal]);

  const filteredStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return staff;
    }
    return staff.filter((member) => {
      const { firstName, lastName, email } = staffDisplayName(member);
      return (
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        `${firstName} ${lastName}`.toLowerCase().includes(term)
      );
    });
  }, [staff, searchTerm]);

  async function handleInvite(inviteData: InviteUserForm): Promise<void> {
    setIsInviting(true);
    const { payload } = await dispatch(
      inviteHospitalStaff({
        email: inviteData.email,
        firstName: inviteData.firstName,
        lastName: inviteData.lastName,
        role: (inviteData.role as InviteHospitalStaffRole) || 'doctor',
      }),
    );
    setIsInviting(false);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setOpenInviteModal(false);
      void loadStaff();
    }
  }

  function openConfirmation(description: string, acceptCommand: () => Promise<void>): void {
    setConfirmation({
      open: true,
      description,
      acceptCommand: (): void => {
        void (async (): Promise<void> => {
          setIsConfirmationLoading(true);
          await acceptCommand();
          setIsConfirmationLoading(false);
        })();
      },
      rejectCommand: (): void => setConfirmation((prev) => ({ ...prev, open: false })),
    });
  }

  async function runStaffAction(action: () => Promise<{ payload: unknown }>): Promise<void> {
    const { payload } = await action();
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setConfirmation((prev) => ({ ...prev, open: false }));
      void loadStaff();
    }
  }

  async function handleUpdateRole(): Promise<void> {
    if (!roleModalStaff) {
      return;
    }
    setIsUpdatingRole(true);
    const { payload } = await dispatch(
      updateHospitalStaffRole({ staffId: roleModalStaff.id, role: selectedRole }),
    );
    setIsUpdatingRole(false);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setOpenRoleModal(false);
      setRoleModalStaff(null);
      void loadStaff();
    }
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  const columns: ColumnDef<IHospitalStaffMember>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => { //NOSONAR
        const { firstName, lastName, imageSrc } = staffDisplayName(original);
        return (
          <AvatarWithName
            imageSrc={imageSrc}
            firstName={firstName}
            lastName={lastName}
          />
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }): string => staffDisplayName(original).email || '—',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => ( //NOSONAR
        <Badge variant={roleBadgeVariant(original.role)} className="capitalize">
          {original.role}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => ( //NOSONAR
        <Badge variant={statusBadgeVariant(original.status)} className="capitalize">
          {original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined / Invited',
      cell: ({ row: { original } }): string =>
        original.createdAt
          ? new Date(original.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—',
    },
    {
      id: 'actions',
      header: 'Action',
      // prettier-ignore
      cell: ({ row: { original } }): JSX.Element => { //NOSONAR
        if (original.role === 'owner') {
          return (
            <span className="inline-flex items-center gap-1 text-sm text-gray-400" title="Owner is locked">
              <Lock className="h-4 w-4" />
              Locked
            </span>
          );
        }

        const status = original.status;
        const { firstName, lastName } = staffDisplayName(original);
        const name = `${firstName} ${lastName}`.trim() || 'this staff member';

        return (
          <ActionsDropdownMenus
            menuContent={[
              {
                title: 'Resend invite',
                visible: status === 'invited',
                clickCommand: (): void => {
                  void handleInvite({
                    email: staffDisplayName(original).email,
                    firstName,
                    lastName,
                    role: (original.role === 'admin' ? 'admin' : 'doctor') as InviteHospitalStaffRole,
                  });
                },
              },
              {
                title: 'Suspend',
                visible: status === 'active',
                clickCommand: () =>
                  openConfirmation(`Suspend ${name}? They will lose hospital access.`, () =>
                    runStaffAction(() => dispatch(suspendHospitalStaff(original.id))),
                  ),
              },
              {
                title: 'Change role',
                visible: status === 'active',
                clickCommand: (): void => {
                  setSelectedRole(
                    original.role === 'admin' ? 'admin' : 'doctor',
                  );
                  setRoleModalStaff(original);
                  setOpenRoleModal(true);
                },
              },
              {
                title: 'Reactivate',
                visible: status === 'suspended',
                clickCommand: () =>
                  openConfirmation(`Reactivate ${name}?`, () =>
                    runStaffAction(() => dispatch(reactivateHospitalStaff(original.id))),
                  ),
              },
              {
                title: 'Remove',
                visible: status === 'invited' || status === 'active' || status === 'suspended',
                clickCommand: () =>
                  openConfirmation(
                    `Remove ${name} from hospital staff? This cannot be undone from here.`,
                    () => runStaffAction(() => dispatch(removeHospitalStaff(original.id))),
                  ),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <Modal
        className="max-w-xl"
        setState={setOpenInviteModal}
        open={openInviteModal}
        content={
          <InviteUser
            title="Staff Invitation"
            buttonTitle="Send Invite"
            showRole
            submit={(inviteData) => void handleInvite(inviteData)}
            isLoading={isInviting}
          />
        }
        showClose={!isInviting}
      />
      <Modal
        className="max-w-md"
        setState={setOpenRoleModal}
        open={openRoleModal}
        content={
          <div className="mx-5 flex flex-col items-center space-y-6 py-2">
            <h2 className="text-center text-2xl font-bold">Change Role</h2>
            <p className="text-center text-sm text-gray-500">
              Update membership role for{' '}
              {roleModalStaff ? staffDisplayName(roleModalStaff).firstName : 'staff'}.
            </p>
            <SelectInputV2
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as InviteHospitalStaffRole)}
              label="Role"
              placeholder="Select role"
              className="w-full max-w-sm"
              options={[
                { value: 'doctor', label: 'Doctor' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
            <Button
              className="w-full max-w-sm"
              child="Save Role"
              onClick={() => void handleUpdateRole()}
              disabled={isUpdatingRole}
              isLoading={isUpdatingRole}
            />
          </div>
        }
        showClose={!isUpdatingRole}
      />
      <Confirmation
        {...confirmation}
        setState={() => setConfirmation((prev) => ({ ...prev, open: false }))}
        isLoading={isConfirmationLoading}
      />

      <div className="mt-4 rounded-lg bg-white p-6">
        <p className="mb-6 text-xl font-bold">Hospital Staff</p>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <form className="flex" onSubmit={handleSubmit}>
              <Input
                error=""
                placeholder="Search by name or email"
                className="max-w-83.25 sm:w-83.25"
                type="search"
                leftIcon={<Search className="cursor-pointer text-gray-500" size={20} />}
                onChange={handleSearch}
              />
              {searchTerm && <Button child={<SendHorizontal />} className="-ml-8" />}
            </form>
            <OptionsMenu
              options={ROLE_FILTER_OPTIONS}
              Icon={ListFilter}
              menuTrigger="Role"
              selected={roleFilter}
              setSelected={(value: string) => setRoleFilter(value as HospitalStaffRole | '')}
              className="h-10 cursor-pointer bg-gray-50 sm:flex"
            />
            <OptionsMenu
              options={STATUS_FILTER_OPTIONS}
              Icon={ListFilter}
              menuTrigger="Status"
              selected={statusFilter}
              setSelected={(value: string) => setStatusFilter(value as HospitalStaffStatus | '')}
              className="h-10 cursor-pointer bg-gray-50 sm:flex"
            />
          </div>
          <Button
            onClick={() => setOpenInviteModal(true)}
            child={
              <>
                <UserRoundPlus /> Invite Staff
              </>
            }
            className="h-10"
          />
        </div>
        <div className="mt-5">
          <TableData
            columns={columns}
            data={filteredStaff}
            isLoading={isLoading}
            manualPagination={false}
            rowCount={Math.max(filteredStaff.length, 10)}
          />
        </div>
      </div>
    </>
  );
};

export default HospitalStaffPanel;
