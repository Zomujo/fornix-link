import { RootState } from '@/lib/store';
import { createSelector } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const selectHospitalStaffState = ({ hospitalStaff }: RootState) => hospitalStaff;

export const selectHospitalStaffList = createSelector(selectHospitalStaffState, ({ list }) => list);

export const selectHospitalStaffLoading = createSelector(
  selectHospitalStaffState,
  ({ isLoading }) => isLoading,
);
