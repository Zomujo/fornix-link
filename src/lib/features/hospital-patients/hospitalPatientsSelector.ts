import { RootState } from '@/lib/store';
import { createSelector } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const selectHospitalPatientsState = ({ hospitalPatients }: RootState) => hospitalPatients;

export const selectHospitalPatientsList = createSelector(
  selectHospitalPatientsState,
  ({ list }) => list,
);

export const selectHospitalPatientSelected = createSelector(
  selectHospitalPatientsState,
  ({ selected }) => selected,
);

export const selectHospitalStaffDoctors = createSelector(
  selectHospitalPatientsState,
  ({ staffDoctors }) => staffDoctors,
);

export const selectHospitalPatientsLoading = createSelector(
  selectHospitalPatientsState,
  ({ isLoading }) => isLoading,
);

export const selectHospitalPatientsMeta = createSelector(
  selectHospitalPatientsState,
  ({ meta }) => meta,
);
