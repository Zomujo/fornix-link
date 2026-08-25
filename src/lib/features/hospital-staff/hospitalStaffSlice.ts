import { createSlice } from '@reduxjs/toolkit';
import { IHospitalStaffMember } from '@/types/hospital-staff.interface';
import { getHospitalStaff } from './hospitalStaffThunk';

interface HospitalStaffState {
  list: IHospitalStaffMember[];
  isLoading: boolean;
}

const initialState: HospitalStaffState = {
  list: [],
  isLoading: false,
};

const hospitalStaffSlice = createSlice({
  name: 'hospitalStaff',
  initialState,
  reducers: {
    clearHospitalStaff: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHospitalStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHospitalStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(getHospitalStaff.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearHospitalStaff } = hospitalStaffSlice.actions;
export default hospitalStaffSlice.reducer;
