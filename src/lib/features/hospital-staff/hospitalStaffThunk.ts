import { createAsyncThunk } from '@reduxjs/toolkit';
import { IResponse } from '@/types/shared.interface';
import axios, { axiosErrorHandler } from '@/lib/axios';
import { Toast } from '@/hooks/use-toast';
import { generateSuccessToast } from '@/lib/utils';
import {
  IHospitalStaffInvitePreview,
  IHospitalStaffMember,
  IHospitalStaffQuery,
  IInviteHospitalStaff,
  InviteHospitalStaffRole,
} from '@/types/hospital-staff.interface';

function staffQueryString(query?: IHospitalStaffQuery): string {
  if (!query) {
    return '';
  }
  const params = new URLSearchParams();
  if (query.role) {
    params.set('role', query.role);
  }
  if (query.status) {
    params.set('status', query.status);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const getHospitalStaff = createAsyncThunk(
  'hospital-staff/getHospitalStaff',
  async (query?: IHospitalStaffQuery): Promise<Toast | IHospitalStaffMember[]> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalStaffMember[]>>(
        `hospitals/staff${staffQueryString(query)}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const inviteHospitalStaff = createAsyncThunk(
  'hospital-staff/inviteHospitalStaff',
  async (payload: IInviteHospitalStaff): Promise<Toast> => {
    try {
      const { data } = await axios.post<IResponse>(`hospitals/staff/invite`, payload);
      return generateSuccessToast(data.message || 'Staff invite sent successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const suspendHospitalStaff = createAsyncThunk(
  'hospital-staff/suspendHospitalStaff',
  async (staffId: string): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(`hospitals/staff/${staffId}/suspend`);
      return generateSuccessToast(data.message || 'Staff suspended successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const reactivateHospitalStaff = createAsyncThunk(
  'hospital-staff/reactivateHospitalStaff',
  async (staffId: string): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(`hospitals/staff/${staffId}/reactivate`);
      return generateSuccessToast(data.message || 'Staff reactivated successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const removeHospitalStaff = createAsyncThunk(
  'hospital-staff/removeHospitalStaff',
  async (staffId: string): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(`hospitals/staff/${staffId}/remove`);
      return generateSuccessToast(data.message || 'Staff removed successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const updateHospitalStaffRole = createAsyncThunk(
  'hospital-staff/updateHospitalStaffRole',
  async (payload: {
    staffId: string;
    role: InviteHospitalStaffRole;
  }): Promise<Toast> => {
    try {
      const { data } = await axios.patch<IResponse>(`hospitals/staff/${payload.staffId}/role`, {
        role: payload.role,
      });
      return generateSuccessToast(data.message || 'Staff role updated successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const getHospitalStaffInvitePreview = createAsyncThunk(
  'hospital-staff/getHospitalStaffInvitePreview',
  async (token: string): Promise<Toast | IHospitalStaffInvitePreview> => {
    try {
      const { data } = await axios.get<IResponse<IHospitalStaffInvitePreview>>(
        `hospitals/staff/invite/${encodeURIComponent(token)}`,
      );
      return data.data;
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const acceptHospitalStaffInvite = createAsyncThunk(
  'hospital-staff/acceptHospitalStaffInvite',
  async (token: string): Promise<Toast> => {
    try {
      const { data } = await axios.post<IResponse>(`hospitals/staff/accept`, { token });
      return generateSuccessToast(data.message || 'Invite accepted successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);

export const declineHospitalStaffInvite = createAsyncThunk(
  'hospital-staff/declineHospitalStaffInvite',
  async (token: string): Promise<Toast> => {
    try {
      const { data } = await axios.post<IResponse>(`hospitals/staff/decline`, { token });
      return generateSuccessToast(data.message || 'Invite declined successfully');
    } catch (error) {
      return axiosErrorHandler(error, true) as Toast;
    }
  },
);
