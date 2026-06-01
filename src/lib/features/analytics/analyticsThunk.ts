import { createAsyncThunk } from '@reduxjs/toolkit';
import { IResponse, IQueryParams } from '@/types/shared.interface';
import axios, { axiosErrorHandler } from '@/lib/axios';
import { Toast } from '@/hooks/use-toast';
import { getValidQueryString } from '@/lib/utils';
import {
  AnalyticsDateRangeParams,
  AnalyticsDateRangeParamsRequired,
  IAppointmentTrends,
  IAppointmentStats,
} from '@/types/analytics.interface';

const HOSPITAL_APPOINTMENT_TRENDS_PATH = 'dashboard/hospital/appointment-trends';
const HOSPITAL_APPOINTMENT_STATS_PATH = 'dashboard/hospital/appointment-stats';

export const getHospitalAppointmentTrends = createAsyncThunk(
  'analytics/getHospitalAppointmentTrends',
  async (params?: AnalyticsDateRangeParams): Promise<Toast | IAppointmentTrends> => {
    try {
      const queryString = getValidQueryString((params ?? {}) as unknown as IQueryParams);
      const url = queryString
        ? `${HOSPITAL_APPOINTMENT_TRENDS_PATH}?${queryString}`
        : HOSPITAL_APPOINTMENT_TRENDS_PATH;
      const { data } = await axios.get<IResponse<IAppointmentTrends>>(url);
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalAppointmentStatsByDateRange = createAsyncThunk(
  'analytics/getHospitalAppointmentStatsByDateRange',
  async (params: AnalyticsDateRangeParamsRequired): Promise<Toast | IAppointmentStats> => {
    try {
      const { data } = await axios.get<IResponse<IAppointmentStats>>(
        `${HOSPITAL_APPOINTMENT_STATS_PATH}?${getValidQueryString(params as unknown as IQueryParams)}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);
