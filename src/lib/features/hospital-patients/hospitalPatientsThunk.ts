import { createAsyncThunk } from '@reduxjs/toolkit';
import { IPagination, IQueryParams, IResponse } from '@/types/shared.interface';
import axios, { axiosErrorHandler } from '@/lib/axios';
import { Toast } from '@/hooks/use-toast';
import { generateSuccessToast, getValidQueryString } from '@/lib/utils';
import {
  IHospitalPatient,
  IHospitalStaffDoctor,
} from '@/types/hospital-patient.interface';
import { AcceptDeclineStatus } from '@/types/shared.enum';

export const getHospitalPatients = createAsyncThunk(
  'hospital-patients/getHospitalPatients',
  async (
    query: IQueryParams<AcceptDeclineStatus | ''>,
  ): Promise<Toast | IPagination<IHospitalPatient>> => {
    try {
      const { data } = await axios.get<IResponse<IPagination<IHospitalPatient>>>(
        `hospitals/patients?${getValidQueryString(query)}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalPatient = createAsyncThunk(
  'hospital-patients/getHospitalPatient',
  async (patientId: string): Promise<Toast | IHospitalPatient> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalPatient>>(
        `hospitals/patients/${patientId}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const assignHospitalPatient = createAsyncThunk(
  'hospital-patients/assignHospitalPatient',
  async (payload: { patientId: string; doctorId: string }): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(
        `hospitals/patients/${payload.patientId}/assign`,
        { doctorId: payload.doctorId },
      );
      return generateSuccessToast(data.message || 'Doctor assigned successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalStaffDoctors = createAsyncThunk(
  'hospital-patients/getHospitalStaffDoctors',
  async (): Promise<Toast | IHospitalStaffDoctor[]> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalStaffDoctor[]>>(
        `hospitals/staff?role=doctor&status=active`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);
