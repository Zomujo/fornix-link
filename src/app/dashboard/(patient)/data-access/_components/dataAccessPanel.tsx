'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Confirmation, ConfirmationProps } from '@/components/ui/dialog';
import {
  getPatientCareAccess,
  revokePatientCareAccess,
} from '@/lib/features/patients/patientsThunk';
import { useAppDispatch } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import {
  ICareAccessGrant,
  ICareAccessHospitalPatient,
  ICareAccessResponse,
} from '@/types/hospital-patient.interface';
import { Toast, toast } from '@/hooks/use-toast';
import { Hospital, Shield, UserRound } from 'lucide-react';
import React, { JSX, useCallback, useEffect, useState } from 'react';

const DataAccessPanel = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [grants, setGrants] = useState<ICareAccessGrant[]>([]);
  const [hospitalRelationships, setHospitalRelationships] = useState<ICareAccessHospitalPatient[]>(
    [],
  );
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationProps>({
    acceptCommand: () => {},
    rejectCommand: () => {},
    description: '',
    open: false,
  });

  const loadCareAccess = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const { payload } = await dispatch(getPatientCareAccess());
    setIsLoading(false);
    if (payload && showErrorToast(payload)) {
      toast(payload as Toast);
      setGrants([]);
      setHospitalRelationships([]);
      return;
    }
    const data = payload as ICareAccessResponse;
    setGrants(data?.grants ?? []);
    setHospitalRelationships(data?.hospitalRelationships ?? []);
  }, [dispatch]);

  useEffect(() => {
    void loadCareAccess();
  }, [loadCareAccess]);

  async function handleRevoke(grantId: string): Promise<void> {
    setRevokingId(grantId);
    const { payload } = await dispatch(revokePatientCareAccess(grantId));
    setRevokingId(null);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setConfirmation((prev) => ({ ...prev, open: false }));
      void loadCareAccess();
    }
  }

  const activeGrants = grants.filter((grant) => grant.status !== 'revoked' && !grant.revokedAt);
  const hasAnyAccess = activeGrants.length > 0 || hospitalRelationships.length > 0;

  return (
    <div className="mt-4 rounded-lg bg-white p-6">
      <div className="mb-6">
        <p className="text-xl font-bold">My Data Access</p>
        <p className="mt-1 text-sm text-gray-500">
          Review who can access your health records and revoke care grants when needed.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : !hasAnyAccess ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">No care relationships yet</p>
            <p className="mt-1.5 max-w-md text-sm text-gray-500">
              When a doctor or hospital is granted access to your records, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {activeGrants.length > 0 && (
            <section>
              <p className="mb-3 text-sm font-semibold text-gray-700">Care Grants</p>
              <div className="space-y-3">
                {activeGrants.map((grant) => {
                  const doctorName = grant.doctor
                    ? `${grant.doctor.firstName} ${grant.doctor.lastName}`.trim()
                    : null;
                  const hospitalName = grant.hospital?.name;
                  return (
                    <div
                      key={grant.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                          {doctorName ? (
                            <UserRound className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Hospital className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doctorName ?? hospitalName ?? 'Care relationship'}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge variant="gray">{grant.status}</Badge>
                            {doctorName && hospitalName && (
                              <span className="text-xs text-gray-500">{hospitalName}</span>
                            )}
                            {grant.expiresAt && (
                              <span className="text-xs text-gray-500">
                                Expires {new Date(grant.expiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        child="Revoke"
                        isLoading={revokingId === grant.id}
                        disabled={revokingId === grant.id}
                        onClick={() =>
                          setConfirmation({
                            open: true,
                            acceptButtonTitle: 'Revoke',
                            rejectButtonTitle: 'Cancel',
                            description: `Revoke access for ${doctorName ?? hospitalName ?? 'this provider'}?`,
                            acceptCommand: () => void handleRevoke(grant.id),
                            rejectCommand: () =>
                              setConfirmation((prev) => ({ ...prev, open: false })),
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {hospitalRelationships.length > 0 && (
            <section>
              <p className="mb-3 text-sm font-semibold text-gray-700">Hospital Relationships</p>
              <div className="space-y-3">
                {hospitalRelationships.map((relationship) => {
                  const doctor = relationship.assignedDoctor;
                  const doctorName = doctor
                    ? `${doctor.firstName} ${doctor.lastName}`.trim()
                    : 'Unassigned';
                  return (
                    <div
                      key={relationship.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                          <Hospital className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {relationship.hospital?.name ?? 'Hospital'}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Assigned doctor: {doctorName}
                          </p>
                        </div>
                      </div>
                      <Badge variant={relationship.assignedDoctorId ? 'default' : 'destructive'}>
                        {relationship.assignedDoctorId ? 'Assigned' : 'Unassigned'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      <Confirmation
        {...confirmation}
        showClose={true}
        setState={() => setConfirmation((prev) => ({ ...prev, open: false }))}
        isLoading={Boolean(revokingId)}
      />
    </div>
  );
};

export default DataAccessPanel;
