import { createSlice } from '@reduxjs/toolkit';
import { IAppointmentTrends, IAppointmentStats } from '@/types/analytics.interface';
import {
  getHospitalAppointmentTrends,
  getHospitalAppointmentStatsByDateRange,
} from './analyticsThunk';
import { isAppointmentStatsPayload, isAppointmentTrendsPayload } from '@/lib/utils/analyticsUtils';

type AnalyticsState = {
  trends: IAppointmentTrends | null;
  stats: IAppointmentStats | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AnalyticsState = {
  trends: null,
  stats: null,
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.trends = null;
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHospitalAppointmentTrends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHospitalAppointmentTrends.fulfilled, (state, action) => {
        state.isLoading = false;
        if (isAppointmentTrendsPayload(action.payload)) {
          state.trends = action.payload;
        }
      })
      .addCase(getHospitalAppointmentTrends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch trends';
      })
      .addCase(getHospitalAppointmentStatsByDateRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHospitalAppointmentStatsByDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        if (isAppointmentStatsPayload(action.payload)) {
          state.stats = action.payload;
        }
      })
      .addCase(getHospitalAppointmentStatsByDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
