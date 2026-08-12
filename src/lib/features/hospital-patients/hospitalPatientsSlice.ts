import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPagination } from '@/types/shared.interface';
import { IHospitalPatient, IHospitalStaffDoctor } from '@/types/hospital-patient.interface';
import {
  getHospitalPatient,
  getHospitalPatients,
  getHospitalStaffDoctors,
} from './hospitalPatientsThunk';

export type IHospitalPatientsMeta = Omit<IPagination<IHospitalPatient>, 'rows'>;

interface HospitalPatientsState {
  list: IHospitalPatient[];
  selected: IHospitalPatient | undefined;
  staffDoctors: IHospitalStaffDoctor[];
  isLoading: boolean;
  meta: IHospitalPatientsMeta | undefined;
}

const initialState: HospitalPatientsState = {
  list: [],
  selected: undefined,
  staffDoctors: [],
  isLoading: false,
  meta: undefined,
};

const hospitalPatientsSlice = createSlice({
  name: 'hospitalPatients',
  initialState,
  reducers: {
    setSelectedHospitalPatient: (state, action: PayloadAction<IHospitalPatient | undefined>) => {
      state.selected = action.payload;
    },
    clearHospitalPatients: (state) => {
      state.list = [];
      state.selected = undefined;
      state.meta = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHospitalPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHospitalPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && 'rows' in action.payload) {
          const { rows, ...meta } = action.payload;
          state.list = rows;
          state.meta = meta;
        }
      })
      .addCase(getHospitalPatients.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getHospitalPatient.fulfilled, (state, action) => {
        if (action.payload && 'id' in action.payload) {
          state.selected = action.payload as IHospitalPatient;
        }
      })
      .addCase(getHospitalStaffDoctors.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.staffDoctors = action.payload;
        }
      });
  },
});

export const { setSelectedHospitalPatient, clearHospitalPatients } = hospitalPatientsSlice.actions;
export default hospitalPatientsSlice.reducer;
